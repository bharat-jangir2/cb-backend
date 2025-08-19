import { Injectable } from "@nestjs/common";
import { BaseScraper } from "./base-scraper";
import {
  ScrapedMatchData,
  ScraperResult,
} from "../interfaces/scraper.interface";
import { SelectorManagerService } from "../services/selector-manager.service";
import { ProxyManagerService } from "../services/proxy-manager.service";
import { DynamicSelectorManagerService } from "../services/dynamic-selector-manager.service";
import { SCRAPER_CONFIGS } from "../config/scraper-config";

@Injectable()
export class CrexScraper extends BaseScraper {
  constructor(
    selectorManager: SelectorManagerService,
    proxyManager: ProxyManagerService,
    private dynamicSelectorManager: DynamicSelectorManagerService
  ) {
    super(SCRAPER_CONFIGS.crex, selectorManager, proxyManager);
  }

  async scrapeMatch(matchId: string): Promise<ScraperResult> {
    return this.executeScraping(matchId);
  }

  protected async performScraping(
    matchId: string,
    userAgent: string,
    proxy: any
  ): Promise<ScrapedMatchData> {
    this.logger.log(`Scraping match ${matchId} from Crex.live`);

    await this.sleep(1800 + Math.random() * 1200);

    const document = this.simulateCrexPage(matchId);

    const team1Data = await this.extractTeamData(document, "team1");
    const team2Data = await this.extractTeamData(document, "team2");
    const commentary = await this.extractCommentary(document);

    const data = this.createScrapedData(
      matchId,
      team1Data,
      team2Data,
      commentary
    );

    if (!this.validateScrapedData(data)) {
      throw new Error("Invalid data extracted from Crex.live");
    }

    return data;
  }

  private async extractTeamData(document: any, teamKey: string): Promise<any> {
    // Get selectors from dynamic config
    const sourceConfig = this.dynamicSelectorManager.getSourceConfig("crex");
    if (!sourceConfig) {
      throw new Error("Crex source configuration not found");
    }

    const selectors = sourceConfig.selectors;

    // Extract team name using dynamic selectors
    const teamNameField = teamKey === "team1" ? "team1Name" : "team2Name";
    const teamNameSelector = this.dynamicSelectorManager.getSelector(
      "crex",
      teamNameField
    );
    const fallbackSelectors = this.dynamicSelectorManager.getFallbackSelectors(
      "crex",
      teamNameField
    );

    const teamNameText = await this.extractElementTextWithFallbacks(
      document,
      teamNameSelector,
      fallbackSelectors,
      "crex",
      teamNameField
    );

    const { name, shortName } = this.parseTeamName(teamNameText);

    // Extract score using dynamic selectors
    const scoreField = teamKey === "team1" ? "team1Score" : "team2Score";
    const scoreSelector = this.dynamicSelectorManager.getSelector(
      "crex",
      scoreField
    );
    const scoreFallbacks = this.dynamicSelectorManager.getFallbackSelectors(
      "crex",
      scoreField
    );

    const scoreText = await this.extractElementTextWithFallbacks(
      document,
      scoreSelector,
      scoreFallbacks,
      "crex",
      scoreField
    );

    const runs = this.parseNumber(scoreText);

    // Extract wickets using dynamic selectors
    const wicketsField = teamKey === "team1" ? "team1Wickets" : "team2Wickets";
    const wicketsSelector = this.dynamicSelectorManager.getSelector(
      "crex",
      wicketsField
    );
    const wicketsFallbacks = this.dynamicSelectorManager.getFallbackSelectors(
      "crex",
      wicketsField
    );

    const wicketsText = await this.extractElementTextWithFallbacks(
      document,
      wicketsSelector,
      wicketsFallbacks,
      "crex",
      wicketsField
    );

    const wickets = this.parseNumber(wicketsText);

    // Extract overs using dynamic selectors
    const oversField = teamKey === "team1" ? "team1Overs" : "team2Overs";
    const oversSelector = this.dynamicSelectorManager.getSelector(
      "crex",
      oversField
    );
    const oversFallbacks = this.dynamicSelectorManager.getFallbackSelectors(
      "crex",
      oversField
    );

    const oversText = await this.extractElementTextWithFallbacks(
      document,
      oversSelector,
      oversFallbacks,
      "crex",
      oversField
    );

    const overs = this.parseOvers(oversText);

    return { name, shortName, runs, wickets, overs };
  }

  private async extractElementTextWithFallbacks(
    document: any,
    primarySelector: string | null,
    fallbackSelectors: string[],
    source: string,
    field: string
  ): Promise<string> {
    const url =
      "https://crex.live/match/" + Math.random().toString(36).substring(7);

    // Try primary selector
    if (primarySelector) {
      const element = document.querySelector(primarySelector);
      if (element && element.textContent?.trim()) {
        await this.selectorManager.recordSelectorSuccess(source, field);
        return element.textContent.trim();
      }
    }

    // Try fallback selectors
    for (const fallbackSelector of fallbackSelectors) {
      const element = document.querySelector(fallbackSelector);
      if (element && element.textContent?.trim()) {
        await this.selectorManager.recordSelectorSuccess(source, field);
        return element.textContent.trim();
      }
    }

    // Try global fallbacks
    const fieldType = this.getFieldType(field);
    const globalFallbacks =
      this.dynamicSelectorManager.getGlobalFallbacks(fieldType);

    for (const globalFallback of globalFallbacks) {
      const element = document.querySelector(globalFallback);
      if (element && element.textContent?.trim()) {
        await this.selectorManager.recordSelectorSuccess(source, field);
        return element.textContent.trim();
      }
    }

    // Record failure for auto-detection
    const attempts = [
      primarySelector,
      ...fallbackSelectors,
      ...globalFallbacks,
    ].filter(Boolean);
    this.dynamicSelectorManager.recordSelectorFailure(
      source,
      field,
      url,
      primarySelector || "unknown",
      attempts
    );

    return "";
  }

  private getFieldType(field: string): string {
    if (field.includes("Name")) return "teamName";
    if (field.includes("Score")) return "score";
    if (field.includes("Wickets")) return "wickets";
    if (field.includes("Overs")) return "overs";
    return "general";
  }

  private async extractCommentary(document: any): Promise<string[]> {
    const commentary: string[] = [];

    try {
      const commentarySelector = this.dynamicSelectorManager.getSelector(
        "crex",
        "commentary"
      );
      const commentaryFallbacks =
        this.dynamicSelectorManager.getFallbackSelectors("crex", "commentary");

      let commentaryElements: any[] = [];

      if (commentarySelector) {
        commentaryElements = document.querySelectorAll(commentarySelector);
      }

      if (commentaryElements.length === 0) {
        for (const fallbackSelector of commentaryFallbacks) {
          commentaryElements = document.querySelectorAll(fallbackSelector);
          if (commentaryElements.length > 0) break;
        }
      }

      for (let i = 0; i < Math.min(commentaryElements.length, 5); i++) {
        const element = commentaryElements[i];
        const text = element.textContent?.trim();
        if (text && text.length > 10) {
          commentary.push(text);
        }
      }
    } catch (error) {
      this.logger.warn("Failed to extract commentary:", error);
    }

    return commentary;
  }

  private simulateCrexPage(matchId: string): any {
    const mockDocument = {
      querySelector: (selector: string) => {
        const matchData = this.getMockMatchData(matchId);

        if (selector.includes("team1") || selector.includes("batting")) {
          if (selector.includes("name")) {
            return { textContent: matchData.team1.name };
          } else if (selector.includes("score")) {
            return { textContent: matchData.team1.runs.toString() };
          } else if (selector.includes("wickets")) {
            return { textContent: matchData.team1.wickets.toString() };
          } else if (selector.includes("overs")) {
            return { textContent: matchData.team1.overs.toString() };
          }
        } else if (selector.includes("team2") || selector.includes("bowling")) {
          if (selector.includes("name")) {
            return { textContent: matchData.team2.name };
          } else if (selector.includes("score")) {
            return { textContent: matchData.team2.runs.toString() };
          } else if (selector.includes("wickets")) {
            return { textContent: matchData.team2.wickets.toString() };
          } else if (selector.includes("overs")) {
            return { textContent: matchData.team2.overs.toString() };
          }
        } else if (selector.includes("commentary")) {
          return { textContent: "Amazing shot! That's a six over long-on!" };
        }

        return null;
      },
      querySelectorAll: (selector: string) => {
        if (selector.includes("commentary")) {
          return [
            { textContent: "The bowler delivers a perfect yorker." },
            { textContent: "The batsman digs it out brilliantly." },
            { textContent: "Excellent fielding saves a certain boundary." },
            { textContent: "The match is reaching its climax." },
            { textContent: "Another tight over from the bowler." },
          ];
        }
        return [];
      },
    };

    return mockDocument;
  }

  private getMockMatchData(matchId: string): any {
    const seed = matchId.charCodeAt(0) + matchId.charCodeAt(matchId.length - 1);
    const random = (min: number, max: number) => min + (seed % (max - min + 1));

    return {
      team1: {
        name: "West Indies",
        shortName: "WI",
        runs: random(200, 380),
        wickets: random(5, 10),
        overs: random(30, 50) + random(0, 5) / 10,
      },
      team2: {
        name: "Sri Lanka",
        shortName: "SL",
        runs: random(150, 300),
        wickets: random(3, 9),
        overs: random(25, 48) + random(0, 5) / 10,
      },
    };
  }
}
