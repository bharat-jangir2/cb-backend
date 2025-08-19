import { Logger } from "@nestjs/common";
import {
  ScrapedMatchData,
  ScraperConfig,
  ScraperResult,
} from "../interfaces/scraper.interface";
import { SelectorManagerService } from "../services/selector-manager.service";
import { ProxyManagerService } from "../services/proxy-manager.service";

export abstract class BaseScraper {
  protected readonly logger = new Logger(this.constructor.name);
  protected config: ScraperConfig;
  protected selectorManager: SelectorManagerService;
  protected proxyManager: ProxyManagerService;

  constructor(
    config: ScraperConfig,
    selectorManager: SelectorManagerService,
    proxyManager: ProxyManagerService
  ) {
    this.config = config;
    this.selectorManager = selectorManager;
    this.proxyManager = proxyManager;
  }

  abstract scrapeMatch(matchId: string): Promise<ScraperResult>;

  protected async executeScraping(matchId: string): Promise<ScraperResult> {
    const startTime = Date.now();
    let proxy = null;

    try {
      // Get proxy for this request
      proxy = await this.proxyManager.getNextProxy();

      // Get random user agent
      const userAgent = this.getRandomUserAgent();

      // Add randomization to delay
      const delay =
        this.config.rateLimit.delayBetweenRequests +
        (Math.random() - 0.5) * 1000; // ±500ms

      await this.sleep(delay);

      // Execute the actual scraping
      const data = await this.performScraping(matchId, userAgent, proxy);

      const responseTime = Date.now() - startTime;

      // Record success
      if (proxy) {
        await this.proxyManager.recordProxySuccess(proxy);
      }

      return {
        success: true,
        data,
        source: this.config.name,
        timestamp: new Date(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Record failure
      if (proxy) {
        await this.proxyManager.recordProxyFailure(proxy, error.message);
      }

      this.logger.error(`Scraping failed for ${matchId}:`, error);

      return {
        success: false,
        error: error.message,
        source: this.config.name,
        timestamp: new Date(),
        responseTime,
      };
    }
  }

  protected abstract performScraping(
    matchId: string,
    userAgent: string,
    proxy: any
  ): Promise<ScrapedMatchData>;

  protected async extractElementText(
    document: any,
    selector: string,
    fallbackSelectors?: string[]
  ): Promise<string> {
    try {
      // Try primary selector
      let element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        await this.selectorManager.recordSelectorSuccess(
          this.config.name,
          selector
        );
        return element.textContent.trim();
      }

      // Try fallback selectors
      if (fallbackSelectors) {
        for (const fallbackSelector of fallbackSelectors) {
          element = document.querySelector(fallbackSelector);
          if (element && element.textContent?.trim()) {
            await this.selectorManager.recordSelectorSuccess(
              this.config.name,
              fallbackSelector
            );
            return element.textContent.trim();
          }
        }
      }

      // Record failure if no selector worked
      await this.selectorManager.recordSelectorFailure(
        this.config.name,
        selector
      );
      return "";
    } catch (error) {
      await this.selectorManager.recordSelectorFailure(
        this.config.name,
        selector
      );
      this.logger.warn(
        `Failed to extract text with selector ${selector}:`,
        error
      );
      return "";
    }
  }

  protected async extractElementAttribute(
    document: any,
    selector: string,
    attribute: string,
    fallbackSelectors?: string[]
  ): Promise<string> {
    try {
      // Try primary selector
      let element = document.querySelector(selector);
      if (element && element.getAttribute(attribute)) {
        await this.selectorManager.recordSelectorSuccess(
          this.config.name,
          selector
        );
        return element.getAttribute(attribute);
      }

      // Try fallback selectors
      if (fallbackSelectors) {
        for (const fallbackSelector of fallbackSelectors) {
          element = document.querySelector(fallbackSelector);
          if (element && element.getAttribute(attribute)) {
            await this.selectorManager.recordSelectorSuccess(
              this.config.name,
              fallbackSelector
            );
            return element.getAttribute(attribute);
          }
        }
      }

      // Record failure if no selector worked
      await this.selectorManager.recordSelectorFailure(
        this.config.name,
        selector
      );
      return "";
    } catch (error) {
      await this.selectorManager.recordSelectorFailure(
        this.config.name,
        selector
      );
      this.logger.warn(
        `Failed to extract attribute ${attribute} with selector ${selector}:`,
        error
      );
      return "";
    }
  }

  protected parseNumber(text: string): number {
    if (!text) return 0;

    // Remove non-numeric characters except decimal points
    const cleaned = text.replace(/[^\d.]/g, "");
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
  }

  protected parseOvers(text: string): number {
    if (!text) return 0;

    // Handle formats like "15.2" or "15.2 overs"
    const match = text.match(/(\d+)\.(\d+)/);
    if (match) {
      const overs = parseInt(match[1]);
      const balls = parseInt(match[2]);
      return overs + balls / 6;
    }

    // Handle just numbers
    return this.parseNumber(text);
  }

  protected parseTeamName(text: string): { name: string; shortName: string } {
    if (!text) return { name: "", shortName: "" };

    const cleaned = text.trim();

    // Extract short name (usually in parentheses or brackets)
    const shortNameMatch = cleaned.match(/[\(\[]([^\)\]]+)[\)\]]/);
    const shortName = shortNameMatch ? shortNameMatch[1].trim() : "";

    // Remove short name from full name
    const fullName = cleaned.replace(/[\(\[][^\)\]]+[\)\]]/g, "").trim();

    return {
      name: fullName || cleaned,
      shortName: shortName || this.generateShortName(cleaned),
    };
  }

  private generateShortName(fullName: string): string {
    // Generate short name from full name
    const words = fullName.split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }

    return words
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  protected getRandomUserAgent(): string {
    const userAgents = this.config.userAgents;
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected validateScrapedData(data: ScrapedMatchData): boolean {
    // Basic validation
    if (!data.teams.team1.name || !data.teams.team2.name) {
      this.logger.warn("Missing team names in scraped data");
      return false;
    }

    if (data.score.team1.runs < 0 || data.score.team2.runs < 0) {
      this.logger.warn("Negative runs detected in scraped data");
      return false;
    }

    if (data.score.team1.wickets > 10 || data.score.team2.wickets > 10) {
      this.logger.warn("Invalid wicket count in scraped data");
      return false;
    }

    if (data.score.team1.overs < 0 || data.score.team2.overs < 0) {
      this.logger.warn("Negative overs detected in scraped data");
      return false;
    }

    return true;
  }

  protected createScrapedData(
    matchId: string,
    team1Data: any,
    team2Data: any,
    commentary: string[] = []
  ): ScrapedMatchData {
    return {
      match_id: matchId,
      teams: {
        team1: {
          name: team1Data.name,
          shortName: team1Data.shortName,
          runs: team1Data.runs,
          wickets: team1Data.wickets,
          overs: team1Data.overs,
        },
        team2: {
          name: team2Data.name,
          shortName: team2Data.shortName,
          runs: team2Data.runs,
          wickets: team2Data.wickets,
          overs: team2Data.overs,
        },
      },
      score: {
        team1: {
          runs: team1Data.runs,
          wickets: team1Data.wickets,
          overs: team1Data.overs,
        },
        team2: {
          runs: team2Data.runs,
          wickets: team2Data.wickets,
          overs: team2Data.overs,
        },
      },
      overs: {
        current: Math.max(team1Data.overs, team2Data.overs),
        total: 50, // Default to 50 overs
      },
      wickets: {
        team1: team1Data.wickets,
        team2: team2Data.wickets,
      },
      commentary,
      last_update: new Date(),
      source: this.config.name,
      reliability: this.config.reliability,
      timestamp: new Date(),
    };
  }
}
