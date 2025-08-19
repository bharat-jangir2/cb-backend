import { Injectable, Logger } from "@nestjs/common";
import {
  ScrapedMatchData,
  ScraperResult,
  ValidationResult,
  ScrapingMetrics,
} from "../interfaces/scraper.interface";
import { SourceManagerService } from "./source-manager.service";
import { DataValidationService } from "./data-validation.service";
import { SelectorManagerService } from "./selector-manager.service";
import { ProxyManagerService } from "./proxy-manager.service";
import { CricinfoScraper } from "../scrapers/cricinfo.scraper";
import { CricbuzzScraper } from "../scrapers/cricbuzz.scraper";
import { FlashscoreScraper } from "../scrapers/flashscore.scraper";
import { CrexScraper } from "../scrapers/crex.scraper";
import { MatchesService } from "../../matches/matches.service";
import { BallsService } from "../../balls/balls.service";
import { SCRAPING_SETTINGS } from "../config/scraper-config";
import { MatchStatus } from "../../common/enums/match-status.enum";
import { DynamicSelectorManagerService } from "./dynamic-selector-manager.service";

@Injectable()
export class ScrapersService {
  private readonly logger = new Logger(ScrapersService.name);
  private readonly scrapers: Map<string, any> = new Map();
  private readonly metrics: ScrapingMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    lastUpdate: new Date(),
    sourcesUsed: {},
    selectorUpdates: [],
    proxyRotations: 0,
  };

  constructor(
    private sourceManager: SourceManagerService,
    private dataValidation: DataValidationService,
    private selectorManager: SelectorManagerService,
    private proxyManager: ProxyManagerService,
    private cricinfoScraper: CricinfoScraper,
    private cricbuzzScraper: CricbuzzScraper,
    private flashscoreScraper: FlashscoreScraper,
    private crexScraper: CrexScraper,
    private matchesService: MatchesService,
    private ballsService: BallsService,
    private dynamicSelectorManager: DynamicSelectorManagerService
  ) {
    this.initializeScrapers();
  }

  private initializeScrapers(): void {
    this.scrapers.set("cricinfo", this.cricinfoScraper);
    this.scrapers.set("cricbuzz", this.cricbuzzScraper);
    this.scrapers.set("flashscore", this.flashscoreScraper);
    this.scrapers.set("crex", this.crexScraper);

    this.logger.log("Scrapers initialized with dynamic selector support");
  }

  async scrapeMatchData(matchId: string): Promise<{
    success: boolean;
    data?: ScrapedMatchData;
    validation?: ValidationResult;
    error?: string;
  }> {
    this.logger.log(`Starting to scrape match data for ${matchId}`);

    try {
      // Get current source
      const currentSource = await this.sourceManager.getCurrentSource();
      const sourceConfig = await this.sourceManager.getSourceConfig(
        currentSource
      );

      // Scrape from primary source
      const primaryResult = await this.scrapeFromSource(matchId, currentSource);

      if (!primaryResult.success) {
        this.logger.warn(
          `Primary source ${currentSource} failed, trying backup sources`
        );

        // Try backup sources
        const backupResult = await this.tryBackupSources(
          matchId,
          currentSource
        );
        if (backupResult.success) {
          return await this.processScrapedData(matchId, backupResult.data!);
        }

        return {
          success: false,
          error: `All sources failed. Primary: ${primaryResult.error}, Backup: ${backupResult.error}`,
        };
      }

      // Try to get backup data for validation
      const backupResult = await this.getBackupData(matchId, currentSource);

      // Process and validate the data
      return await this.processScrapedData(
        matchId,
        primaryResult.data!,
        backupResult.data
      );
    } catch (error) {
      this.logger.error(`Error scraping match ${matchId}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async scrapeFromSource(
    matchId: string,
    sourceName: string
  ): Promise<ScraperResult> {
    const scraper = this.scrapers.get(sourceName);
    if (!scraper) {
      throw new Error(`Unknown scraper: ${sourceName}`);
    }

    const startTime = Date.now();

    try {
      const result = await scraper.scrapeMatch(matchId);

      // Update metrics
      this.updateMetrics(sourceName, result.success, result.responseTime);

      // Update source status
      await this.sourceManager.updateSourceStatus(sourceName, result);

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      const result: ScraperResult = {
        success: false,
        error: error.message,
        source: sourceName,
        timestamp: new Date(),
        responseTime,
      };

      // Update metrics
      this.updateMetrics(sourceName, false, responseTime);

      // Update source status
      await this.sourceManager.updateSourceStatus(sourceName, result);

      return result;
    }
  }

  private async tryBackupSources(
    matchId: string,
    failedSource: string
  ): Promise<ScraperResult> {
    const availableSources = await this.sourceManager.getAllSourceStatuses();
    const backupSources = availableSources
      .filter((status) => status.name !== failedSource && status.isActive)
      .sort((a, b) => b.reliability - a.reliability);

    for (const sourceStatus of backupSources) {
      this.logger.log(`Trying backup source: ${sourceStatus.name}`);

      try {
        const result = await this.scrapeFromSource(matchId, sourceStatus.name);
        if (result.success) {
          return result;
        }
      } catch (error) {
        this.logger.warn(`Backup source ${sourceStatus.name} failed:`, error);
      }
    }

    return {
      success: false,
      error: "All backup sources failed",
      source: "backup",
      timestamp: new Date(),
      responseTime: 0,
    };
  }

  private async getBackupData(
    matchId: string,
    primarySource: string
  ): Promise<{ data?: ScrapedMatchData }> {
    try {
      // Get data from a different source for validation
      const availableSources = await this.sourceManager.getAllSourceStatuses();
      const backupSource = availableSources.find(
        (status) => status.name !== primarySource && status.isActive
      );

      if (backupSource) {
        const result = await this.scrapeFromSource(matchId, backupSource.name);
        if (result.success && result.data) {
          return { data: result.data };
        }
      }
    } catch (error) {
      this.logger.warn("Failed to get backup data for validation:", error);
    }

    return {};
  }

  private async processScrapedData(
    matchId: string,
    primaryData: ScrapedMatchData,
    backupData?: ScrapedMatchData
  ): Promise<{
    success: boolean;
    data?: ScrapedMatchData;
    validation?: ValidationResult;
    error?: string;
  }> {
    try {
      // Validate the data
      const validation = await this.dataValidation.validateData(
        primaryData,
        backupData
      );

      if (!validation.isValid) {
        this.logger.warn(
          `Data validation failed for match ${matchId}:`,
          validation.discrepancies
        );

        // If validation failed but we have backup data, try using the recommended source
        if (backupData && validation.recommendedSource !== primaryData.source) {
          this.logger.log(
            `Switching to recommended source: ${validation.recommendedSource}`
          );
          const recommendedData =
            validation.crossCheckResults[validation.recommendedSource]?.data;
          if (recommendedData) {
            return {
              success: true,
              data: recommendedData,
              validation,
            };
          }
        }

        return {
          success: false,
          error: `Data validation failed: ${validation.discrepancies.join(
            ", "
          )}`,
          validation,
        };
      }

      // Update the backend with the scraped data
      await this.updateBackend(matchId, primaryData);

      // Update last update time
      await this.sourceManager.updateLastUpdateTime();

      return {
        success: true,
        data: primaryData,
        validation,
      };
    } catch (error) {
      this.logger.error(
        `Error processing scraped data for match ${matchId}:`,
        error
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async updateBackend(
    matchId: string,
    data: ScrapedMatchData
  ): Promise<void> {
    try {
      // Check if match exists
      const match = await this.matchesService.findById(matchId);
      if (!match) {
        this.logger.warn(`Match ${matchId} not found in backend`);
        return;
      }

      // Update match score if it has changed
      const currentState = await this.matchesService.getMatchState(matchId);
      const hasScoreChanged = this.hasScoreChanged(currentState, data);

      if (hasScoreChanged) {
        this.logger.log(`Updating match ${matchId} with new score data`);

        // Update match status and score
        await this.matchesService.updateStatus(matchId, {
          status: MatchStatus.IN_PROGRESS,
          currentInnings: data.overs.current > 0 ? 1 : 0,
          currentOver: Math.floor(data.overs.current),
          currentBall: Math.round((data.overs.current % 1) * 6),
        });

        // Add ball event if score changed significantly
        await this.addBallEventIfNeeded(matchId, currentState, data);
      }
    } catch (error) {
      this.logger.error(`Error updating backend for match ${matchId}:`, error);
      throw error;
    }
  }

  private hasScoreChanged(
    currentState: any,
    newData: ScrapedMatchData
  ): boolean {
    if (!currentState.score) return true;

    const current = currentState.score;
    const newScore = newData.score;

    return (
      current.teamA.runs !== newScore.team1.runs ||
      current.teamA.wickets !== newScore.team1.wickets ||
      current.teamA.overs !== newScore.team1.overs ||
      current.teamB.runs !== newScore.team2.runs ||
      current.teamB.wickets !== newScore.team2.wickets ||
      current.teamB.overs !== newScore.team2.overs
    );
  }

  private async addBallEventIfNeeded(
    matchId: string,
    currentState: any,
    newData: ScrapedMatchData
  ): Promise<void> {
    try {
      // Only add ball event if there's a significant change (runs or wickets)
      const current = currentState.score || {
        teamA: { runs: 0, wickets: 0 },
        teamB: { runs: 0, wickets: 0 },
      };
      const newScore = newData.score;

      const runsDiff =
        newScore.team1.runs -
        current.teamA.runs +
        (newScore.team2.runs - current.teamB.runs);
      const wicketsDiff =
        newScore.team1.wickets -
        current.teamA.wickets +
        (newScore.team2.wickets - current.teamB.wickets);

      if (runsDiff > 0 || wicketsDiff > 0) {
        // Determine which team scored
        const team1RunsDiff = newScore.team1.runs - current.teamA.runs;
        const team2RunsDiff = newScore.team2.runs - current.teamB.runs;

        const ballData = {
          innings: team1RunsDiff > 0 ? 1 : 2,
          over: Math.floor(newData.overs.current),
          ball: Math.round((newData.overs.current % 1) * 6) || 1,
          eventType: (wicketsDiff > 0 ? "wicket" : "runs") as
            | "runs"
            | "wicket"
            | "extra"
            | "over_change"
            | "innings_change",
          runs: Math.max(team1RunsDiff, team2RunsDiff),
          wicket:
            wicketsDiff > 0
              ? { type: "bowled" as const, batsman: "temp" }
              : undefined,
          description: `Auto-updated from ${newData.source}`,
        };

        await this.ballsService.create(matchId, ballData);
        this.logger.log(
          `Added ball event for match ${matchId}: ${ballData.runs} runs`
        );
      }
    } catch (error) {
      this.logger.warn(`Failed to add ball event for match ${matchId}:`, error);
    }
  }

  private updateMetrics(
    sourceName: string,
    success: boolean,
    responseTime: number
  ): void {
    this.metrics.totalRequests++;

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Update average response time
    const totalTime =
      this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) +
      responseTime;
    this.metrics.averageResponseTime = totalTime / this.metrics.totalRequests;

    // Update source-specific metrics
    if (!this.metrics.sourcesUsed[sourceName]) {
      this.metrics.sourcesUsed[sourceName] = {
        requests: 0,
        successes: 0,
        failures: 0,
        averageResponseTime: 0,
      };
    }

    const sourceMetrics = this.metrics.sourcesUsed[sourceName];
    sourceMetrics.requests++;

    if (success) {
      sourceMetrics.successes++;
    } else {
      sourceMetrics.failures++;
    }

    const sourceTotalTime =
      sourceMetrics.averageResponseTime * (sourceMetrics.requests - 1) +
      responseTime;
    sourceMetrics.averageResponseTime =
      sourceTotalTime / sourceMetrics.requests;

    this.metrics.lastUpdate = new Date();
  }

  async getMetrics(): Promise<ScrapingMetrics> {
    // Get selector updates
    const selectorUpdates = await this.selectorManager.getSelectorUpdates();
    this.metrics.selectorUpdates = selectorUpdates;

    // Get proxy rotation count
    const proxyStats = await this.proxyManager.getProxyStats();
    this.metrics.proxyRotations = proxyStats.rotationCount;

    return this.metrics;
  }

  async getSystemStatus(): Promise<{
    isHealthy: boolean;
    currentSource: string;
    lastUpdate: Date | null;
    successRate: number;
    averageResponseTime: number;
    availableSources: number;
    totalSources: number;
  }> {
    const sourceHealth = await this.sourceManager.getSystemHealth();
    const successRate =
      this.metrics.totalRequests > 0
        ? this.metrics.successfulRequests / this.metrics.totalRequests
        : 0;

    return {
      isHealthy: sourceHealth.availableSources > 0 && successRate > 0.5,
      currentSource: sourceHealth.currentSource,
      lastUpdate: sourceHealth.lastUpdate,
      successRate,
      averageResponseTime: this.metrics.averageResponseTime,
      availableSources: sourceHealth.availableSources,
      totalSources: sourceHealth.totalSources,
    };
  }

  async forceSourceRotation(): Promise<void> {
    // Force rotation to next available source
    const currentSource = await this.sourceManager.getCurrentSource();
    const nextSource = await this.sourceManager.getNextSource(currentSource);

    if (nextSource !== currentSource) {
      this.logger.log(
        `Forced source rotation from ${currentSource} to ${nextSource}`
      );
    }
  }

  async testSource(
    sourceName: string,
    matchId: string
  ): Promise<{
    success: boolean;
    data?: ScrapedMatchData;
    error?: string;
    responseTime: number;
  }> {
    try {
      const startTime = Date.now();
      const result = await this.scrapeFromSource(matchId, sourceName);
      const responseTime = Date.now() - startTime;

      return {
        success: result.success,
        data: result.data,
        error: result.error,
        responseTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        responseTime: 0,
      };
    }
  }
}
