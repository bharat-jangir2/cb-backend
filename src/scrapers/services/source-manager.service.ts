import { Injectable, Logger } from "@nestjs/common";
import {
  ScraperConfig,
  ScraperResult,
  SourceStatus,
} from "../interfaces/scraper.interface";
import { SCRAPER_CONFIGS, SCRAPING_SETTINGS } from "../config/scraper-config";

@Injectable()
export class SourceManagerService {
  private readonly logger = new Logger(SourceManagerService.name);
  private readonly sourceStatuses: Map<string, SourceStatus> = new Map();
  private currentPrimarySource: string;
  private lastUpdateTime: Date | null = null;
  private failoverHistory: Array<{
    from: string;
    to: string;
    reason: string;
    timestamp: Date;
  }> = [];

  constructor() {
    this.initializeSources();
  }

  private initializeSources(): void {
    Object.keys(SCRAPER_CONFIGS).forEach((sourceName) => {
      const config = SCRAPER_CONFIGS[sourceName];
      this.sourceStatuses.set(sourceName, {
        name: sourceName,
        isActive: true,
        lastSuccess: new Date(0),
        lastError: new Date(0),
        errorCount: 0,
        successCount: 0,
        averageResponseTime: 0,
        reliability: config.reliability,
        currentSelectorVersion: "1.0",
      });
    });

    // Set primary source based on priority
    this.currentPrimarySource = this.getHighestPrioritySource();
    this.logger.log(
      `Initialized source manager with primary source: ${this.currentPrimarySource}`
    );
  }

  private getHighestPrioritySource(): string {
    return Object.entries(SCRAPER_CONFIGS)
      .sort(([, a], [, b]) => a.priority - b.priority)
      .map(([name]) => name)[0];
  }

  async getNextSource(currentSource?: string): Promise<string> {
    const sources = this.getAvailableSources();

    if (sources.length === 0) {
      throw new Error("No available sources");
    }

    // If no current source or current source is failing, get the best available source
    if (!currentSource || !this.isSourceHealthy(currentSource)) {
      return this.getBestAvailableSource();
    }

    // If current source is healthy, continue using it
    if (this.isSourceHealthy(currentSource)) {
      return currentSource;
    }

    // Find next best source
    const currentIndex = sources.findIndex((s) => s === currentSource);
    const nextIndex = (currentIndex + 1) % sources.length;
    return sources[nextIndex];
  }

  private getAvailableSources(): string[] {
    return Array.from(this.sourceStatuses.entries())
      .filter(([, status]) => status.isActive)
      .map(([name]) => name)
      .sort((a, b) => {
        const statusA = this.sourceStatuses.get(a)!;
        const statusB = this.sourceStatuses.get(b)!;
        return statusB.reliability - statusA.reliability;
      });
  }

  private getBestAvailableSource(): string {
    const availableSources = this.getAvailableSources();
    if (availableSources.length === 0) {
      throw new Error("No available sources");
    }

    // Return the source with highest reliability and recent success
    return availableSources.reduce((best, current) => {
      const bestStatus = this.sourceStatuses.get(best)!;
      const currentStatus = this.sourceStatuses.get(current)!;

      // Prefer sources with recent success
      if (currentStatus.lastSuccess > bestStatus.lastSuccess) {
        return current;
      }

      // If success times are similar, prefer higher reliability
      if (
        Math.abs(
          currentStatus.lastSuccess.getTime() - bestStatus.lastSuccess.getTime()
        ) < 60000
      ) {
        return currentStatus.reliability > bestStatus.reliability
          ? current
          : best;
      }

      return best;
    });
  }

  private isSourceHealthy(sourceName: string): boolean {
    const status = this.sourceStatuses.get(sourceName);
    if (!status || !status.isActive) {
      return false;
    }

    // Check if source has failed too many times recently
    if (status.errorCount > 5) {
      return false;
    }

    // Check if source is too old (more than 10 seconds)
    const timeSinceLastSuccess = Date.now() - status.lastSuccess.getTime();
    if (timeSinceLastSuccess > SCRAPING_SETTINGS.failoverTimeout) {
      return false;
    }

    return true;
  }

  async updateSourceStatus(
    sourceName: string,
    result: ScraperResult
  ): Promise<void> {
    const status = this.sourceStatuses.get(sourceName);
    if (!status) {
      this.logger.warn(`Unknown source: ${sourceName}`);
      return;
    }

    if (result.success) {
      status.lastSuccess = result.timestamp;
      status.successCount++;
      status.averageResponseTime = this.calculateAverageResponseTime(
        status.averageResponseTime,
        status.successCount,
        result.responseTime
      );
      status.errorCount = Math.max(0, status.errorCount - 1); // Reduce error count on success
    } else {
      status.lastError = result.timestamp;
      status.errorCount++;
      this.logger.warn(`Source ${sourceName} failed: ${result.error}`);
    }

    // Check if we need to failover
    await this.checkFailover(sourceName, result);
  }

  private async checkFailover(
    failedSource: string,
    result: ScraperResult
  ): Promise<void> {
    if (
      failedSource === this.currentPrimarySource &&
      !this.isSourceHealthy(failedSource)
    ) {
      const newSource = await this.getNextSource(failedSource);

      if (newSource !== failedSource) {
        this.performFailover(
          failedSource,
          newSource,
          result.error || "Unknown error"
        );
      }
    }
  }

  private performFailover(
    fromSource: string,
    toSource: string,
    reason: string
  ): void {
    this.logger.warn(
      `Performing failover from ${fromSource} to ${toSource}: ${reason}`
    );

    this.failoverHistory.push({
      from: fromSource,
      to: toSource,
      reason,
      timestamp: new Date(),
    });

    this.currentPrimarySource = toSource;

    // Keep only last 100 failover events
    if (this.failoverHistory.length > 100) {
      this.failoverHistory = this.failoverHistory.slice(-100);
    }
  }

  private calculateAverageResponseTime(
    currentAverage: number,
    count: number,
    newResponseTime: number
  ): number {
    return (currentAverage * (count - 1) + newResponseTime) / count;
  }

  async getCurrentSource(): Promise<string> {
    // Check if current source is still healthy
    if (!this.isSourceHealthy(this.currentPrimarySource)) {
      const newSource = await this.getNextSource(this.currentPrimarySource);
      if (newSource !== this.currentPrimarySource) {
        this.performFailover(
          this.currentPrimarySource,
          newSource,
          "Source became unhealthy"
        );
      }
    }

    return this.currentPrimarySource;
  }

  async getSourceConfig(sourceName: string): Promise<ScraperConfig> {
    const config = SCRAPER_CONFIGS[sourceName];
    if (!config) {
      throw new Error(`Unknown source: ${sourceName}`);
    }
    return config;
  }

  async getAllSourceStatuses(): Promise<SourceStatus[]> {
    return Array.from(this.sourceStatuses.values());
  }

  async getFailoverHistory(): Promise<
    Array<{
      from: string;
      to: string;
      reason: string;
      timestamp: Date;
    }>
  > {
    return this.failoverHistory;
  }

  async disableSource(sourceName: string): Promise<void> {
    const status = this.sourceStatuses.get(sourceName);
    if (status) {
      status.isActive = false;
      this.logger.warn(`Source ${sourceName} disabled`);

      // If this was the current primary source, failover to another
      if (sourceName === this.currentPrimarySource) {
        const newSource = await this.getNextSource(sourceName);
        this.performFailover(sourceName, newSource, "Source manually disabled");
      }
    }
  }

  async enableSource(sourceName: string): Promise<void> {
    const status = this.sourceStatuses.get(sourceName);
    if (status) {
      status.isActive = true;
      status.errorCount = 0; // Reset error count
      this.logger.log(`Source ${sourceName} enabled`);
    }
  }

  async resetSourceStats(sourceName: string): Promise<void> {
    const status = this.sourceStatuses.get(sourceName);
    if (status) {
      status.errorCount = 0;
      status.successCount = 0;
      status.averageResponseTime = 0;
      this.logger.log(`Reset stats for source ${sourceName}`);
    }
  }

  async updateLastUpdateTime(): Promise<void> {
    this.lastUpdateTime = new Date();
  }

  async getLastUpdateTime(): Promise<Date | null> {
    return this.lastUpdateTime;
  }

  async getSystemHealth(): Promise<{
    currentSource: string;
    availableSources: number;
    totalSources: number;
    lastUpdate: Date | null;
    failoverCount: number;
    averageResponseTime: number;
  }> {
    const availableSources = this.getAvailableSources().length;
    const totalSources = this.sourceStatuses.size;
    const failoverCount = this.failoverHistory.length;

    const averageResponseTime =
      Array.from(this.sourceStatuses.values())
        .filter((status) => status.averageResponseTime > 0)
        .reduce((sum, status) => sum + status.averageResponseTime, 0) /
      Array.from(this.sourceStatuses.values()).filter(
        (status) => status.averageResponseTime > 0
      ).length;

    return {
      currentSource: this.currentPrimarySource,
      availableSources,
      totalSources,
      lastUpdate: this.lastUpdateTime,
      failoverCount,
      averageResponseTime: averageResponseTime || 0,
    };
  }
}
