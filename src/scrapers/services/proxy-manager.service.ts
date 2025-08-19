import { Injectable, Logger } from "@nestjs/common";
import { ProxyConfig } from "../interfaces/scraper.interface";
import { PROXY_CONFIGS } from "../config/scraper-config";

@Injectable()
export class ProxyManagerService {
  private readonly logger = new Logger(ProxyManagerService.name);
  private readonly proxies: ProxyConfig[] = [];
  private currentProxyIndex = 0;
  private proxyFailures: Map<string, number> = new Map();
  private proxySuccesses: Map<string, number> = new Map();
  private lastRotationTime = new Date();

  constructor() {
    this.initializeProxies();
  }

  private initializeProxies(): void {
    // Load proxies from config
    this.proxies.push(...PROXY_CONFIGS);

    // Sort by reliability
    this.proxies.sort((a, b) => b.reliability - a.reliability);

    this.logger.log(`Initialized ${this.proxies.length} proxies`);
  }

  async getNextProxy(): Promise<ProxyConfig | null> {
    if (this.proxies.length === 0) {
      return null;
    }

    // Check if we need to rotate proxies
    await this.checkRotationNeeded();

    // Get the best available proxy
    const proxy = this.getBestAvailableProxy();

    if (proxy) {
      this.logger.debug(`Selected proxy: ${proxy.host}:${proxy.port}`);
    }

    return proxy;
  }

  private async checkRotationNeeded(): Promise<void> {
    const timeSinceRotation = Date.now() - this.lastRotationTime.getTime();
    const rotationInterval = 5 * 60 * 1000; // 5 minutes

    // Rotate if enough time has passed or if current proxy is failing
    if (timeSinceRotation > rotationInterval) {
      await this.rotateProxies();
    }
  }

  private getBestAvailableProxy(): ProxyConfig | null {
    // Filter out proxies with too many failures
    const availableProxies = this.proxies.filter((proxy) => {
      const failures = this.proxyFailures.get(this.getProxyKey(proxy)) || 0;
      return failures < 5; // Max 5 failures before considering proxy unavailable
    });

    if (availableProxies.length === 0) {
      this.logger.warn(
        "No available proxies, all proxies have too many failures"
      );
      return null;
    }

    // Sort by success rate and reliability
    availableProxies.sort((a, b) => {
      const aSuccesses = this.proxySuccesses.get(this.getProxyKey(a)) || 0;
      const aFailures = this.proxyFailures.get(this.getProxyKey(a)) || 0;
      const aTotal = aSuccesses + aFailures;
      const aSuccessRate = aTotal > 0 ? aSuccesses / aTotal : 0;

      const bSuccesses = this.proxySuccesses.get(this.getProxyKey(b)) || 0;
      const bFailures = this.proxyFailures.get(this.getProxyKey(b)) || 0;
      const bTotal = bSuccesses + bFailures;
      const bSuccessRate = bTotal > 0 ? bSuccesses / bTotal : 0;

      // Combine success rate and reliability
      const aScore = aSuccessRate * 0.7 + a.reliability * 0.3;
      const bScore = bSuccessRate * 0.7 + b.reliability * 0.3;

      return bScore - aScore;
    });

    return availableProxies[0];
  }

  private async rotateProxies(): Promise<void> {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
    this.lastRotationTime = new Date();

    this.logger.log(
      `Rotated to proxy ${this.currentProxyIndex + 1}/${this.proxies.length}`
    );
  }

  async recordProxySuccess(proxy: ProxyConfig): Promise<void> {
    const key = this.getProxyKey(proxy);
    const currentSuccesses = this.proxySuccesses.get(key) || 0;
    this.proxySuccesses.set(key, currentSuccesses + 1);

    this.logger.debug(`Proxy success recorded: ${proxy.host}:${proxy.port}`);
  }

  async recordProxyFailure(proxy: ProxyConfig, error?: string): Promise<void> {
    const key = this.getProxyKey(proxy);
    const currentFailures = this.proxyFailures.get(key) || 0;
    this.proxyFailures.set(key, currentFailures + 1);

    this.logger.warn(
      `Proxy failure recorded: ${proxy.host}:${proxy.port} - ${
        error || "Unknown error"
      }`
    );

    // If this proxy has too many failures, trigger rotation
    if (currentFailures + 1 >= 3) {
      await this.rotateProxies();
    }
  }

  private getProxyKey(proxy: ProxyConfig): string {
    return `${proxy.host}:${proxy.port}`;
  }

  async addProxy(proxy: ProxyConfig): Promise<void> {
    // Check if proxy already exists
    const existingIndex = this.proxies.findIndex(
      (p) => p.host === proxy.host && p.port === proxy.port
    );

    if (existingIndex >= 0) {
      this.logger.warn(`Proxy already exists: ${proxy.host}:${proxy.port}`);
      return;
    }

    this.proxies.push(proxy);
    this.proxies.sort((a, b) => b.reliability - a.reliability);

    this.logger.log(`Added new proxy: ${proxy.host}:${proxy.port}`);
  }

  async removeProxy(host: string, port: number): Promise<void> {
    const index = this.proxies.findIndex(
      (p) => p.host === host && p.port === port
    );

    if (index >= 0) {
      const proxy = this.proxies[index];
      this.proxies.splice(index, 1);

      // Clean up stats
      const key = this.getProxyKey(proxy);
      this.proxyFailures.delete(key);
      this.proxySuccesses.delete(key);

      this.logger.log(`Removed proxy: ${host}:${port}`);
    } else {
      this.logger.warn(`Proxy not found: ${host}:${port}`);
    }
  }

  async getProxyStats(): Promise<{
    totalProxies: number;
    availableProxies: number;
    currentProxy: ProxyConfig | null;
    rotationCount: number;
    averageSuccessRate: number;
    proxyDetails: Array<{
      proxy: ProxyConfig;
      successes: number;
      failures: number;
      successRate: number;
    }>;
  }> {
    const currentProxy = this.getBestAvailableProxy();
    const availableProxies = this.proxies.filter((proxy) => {
      const failures = this.proxyFailures.get(this.getProxyKey(proxy)) || 0;
      return failures < 5;
    }).length;

    const proxyDetails = this.proxies.map((proxy) => {
      const key = this.getProxyKey(proxy);
      const successes = this.proxySuccesses.get(key) || 0;
      const failures = this.proxyFailures.get(key) || 0;
      const total = successes + failures;
      const successRate = total > 0 ? successes / total : 0;

      return {
        proxy,
        successes,
        failures,
        successRate,
      };
    });

    const totalSuccesses = proxyDetails.reduce(
      (sum, detail) => sum + detail.successes,
      0
    );
    const totalFailures = proxyDetails.reduce(
      (sum, detail) => sum + detail.failures,
      0
    );
    const totalRequests = totalSuccesses + totalFailures;
    const averageSuccessRate =
      totalRequests > 0 ? totalSuccesses / totalRequests : 0;

    return {
      totalProxies: this.proxies.length,
      availableProxies,
      currentProxy,
      rotationCount: Math.floor(
        (Date.now() - this.lastRotationTime.getTime()) / (5 * 60 * 1000)
      ),
      averageSuccessRate,
      proxyDetails,
    };
  }

  async resetProxyStats(host?: string, port?: number): Promise<void> {
    if (host && port) {
      const key = `${host}:${port}`;
      this.proxyFailures.delete(key);
      this.proxySuccesses.delete(key);
      this.logger.log(`Reset stats for proxy: ${host}:${port}`);
    } else {
      this.proxyFailures.clear();
      this.proxySuccesses.clear();
      this.logger.log("Reset all proxy stats");
    }
  }

  async getProxyHealth(): Promise<{
    isHealthy: boolean;
    availableCount: number;
    totalCount: number;
    averageSuccessRate: number;
    lastRotation: Date;
  }> {
    const stats = await this.getProxyStats();
    const isHealthy =
      stats.availableProxies > 0 && stats.averageSuccessRate > 0.5;

    return {
      isHealthy,
      availableCount: stats.availableProxies,
      totalCount: stats.totalProxies,
      averageSuccessRate: stats.averageSuccessRate,
      lastRotation: this.lastRotationTime,
    };
  }

  async forceRotation(): Promise<void> {
    await this.rotateProxies();
    this.logger.log("Forced proxy rotation");
  }

  async getProxyConfig(
    host: string,
    port: number
  ): Promise<ProxyConfig | null> {
    return this.proxies.find((p) => p.host === host && p.port === port) || null;
  }

  async updateProxyReliability(
    host: string,
    port: number,
    reliability: number
  ): Promise<void> {
    const proxy = this.proxies.find((p) => p.host === host && p.port === port);

    if (proxy) {
      proxy.reliability = Math.max(0, Math.min(1, reliability));
      this.proxies.sort((a, b) => b.reliability - a.reliability);
      this.logger.log(
        `Updated reliability for ${host}:${port} to ${reliability}`
      );
    } else {
      this.logger.warn(
        `Proxy not found for reliability update: ${host}:${port}`
      );
    }
  }
}
