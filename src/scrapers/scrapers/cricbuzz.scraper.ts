import { Injectable } from "@nestjs/common";
import { BaseScraper } from "./base-scraper";
import {
  ScrapedMatchData,
  ScraperResult,
} from "../interfaces/scraper.interface";
import { SelectorManagerService } from "../services/selector-manager.service";
import { ProxyManagerService } from "../services/proxy-manager.service";
import { SCRAPER_CONFIGS } from "../config/scraper-config";

@Injectable()
export class CricbuzzScraper extends BaseScraper {
  constructor(
    selectorManager: SelectorManagerService,
    proxyManager: ProxyManagerService
  ) {
    super(SCRAPER_CONFIGS.cricbuzz, selectorManager, proxyManager);
  }

  async scrapeMatch(matchId: string): Promise<ScraperResult> {
    return this.executeScraping(matchId);
  }

  protected async performScraping(
    matchId: string,
    userAgent: string,
    proxy: any
  ): Promise<ScrapedMatchData> {
    this.logger.log(`Scraping match ${matchId} from Cricbuzz`);

    await this.sleep(1200 + Math.random() * 1800);

    const document = this.simulateCricbuzzPage(matchId);

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
      throw new Error("Invalid data extracted from Cricbuzz");
    }

    return data;
  }

  private async extractTeamData(document: any, teamKey: string): Promise<any> {
    const selectors = this.config.selectors;

    const teamNameSelector =
      teamKey === "team1" ? selectors.team1Name : selectors.team2Name;
    const teamNameText = await this.extractElementText(
      document,
      teamNameSelector,
      [`.${teamKey} .team-name`, `.${teamKey} h3`, `.${teamKey} .name`]
    );

    const { name, shortName } = this.parseTeamName(teamNameText);

    const scoreSelector =
      teamKey === "team1" ? selectors.team1Score : selectors.team2Score;
    const scoreText = await this.extractElementText(document, scoreSelector, [
      `.${teamKey} .score`,
      `.${teamKey} .runs`,
      `.${teamKey} [data-testid="score"]`,
    ]);

    const runs = this.parseNumber(scoreText);

    const wicketsSelector =
      teamKey === "team1" ? selectors.team1Wickets : selectors.team2Wickets;
    const wicketsText = await this.extractElementText(
      document,
      wicketsSelector,
      [
        `.${teamKey} .wickets`,
        `.${teamKey} .wicket-count`,
        `.${teamKey} [data-testid="wickets"]`,
      ]
    );

    const wickets = this.parseNumber(wicketsText);

    const oversSelector =
      teamKey === "team1" ? selectors.team1Overs : selectors.team2Overs;
    const oversText = await this.extractElementText(document, oversSelector, [
      `.${teamKey} .overs`,
      `.${teamKey} .over-count`,
      `.${teamKey} [data-testid="overs"]`,
    ]);

    const overs = this.parseOvers(oversText);

    return { name, shortName, runs, wickets, overs };
  }

  private async extractCommentary(document: any): Promise<string[]> {
    const commentary: string[] = [];

    try {
      const commentaryElements = document.querySelectorAll(
        this.config.selectors.commentary
      );

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

  private simulateCricbuzzPage(matchId: string): any {
    const mockDocument = {
      querySelector: (selector: string) => {
        const matchData = this.getMockMatchData(matchId);

        if (selector.includes("team1")) {
          if (selector.includes("name")) {
            return { textContent: matchData.team1.name };
          } else if (selector.includes("score")) {
            return { textContent: matchData.team1.runs.toString() };
          } else if (selector.includes("wickets")) {
            return { textContent: matchData.team1.wickets.toString() };
          } else if (selector.includes("overs")) {
            return { textContent: matchData.team1.overs.toString() };
          }
        } else if (selector.includes("team2")) {
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
          return { textContent: "Beautiful shot! That's four runs." };
        }

        return null;
      },
      querySelectorAll: (selector: string) => {
        if (selector.includes("commentary")) {
          return [
            { textContent: "The bowler delivers a good length ball." },
            { textContent: "The batsman plays it with soft hands." },
            { textContent: "Good fielding effort saves a boundary." },
            { textContent: "The pressure is building on the batting side." },
            { textContent: "Another dot ball, excellent bowling." },
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
        name: "England",
        shortName: "ENG",
        runs: random(150, 320),
        wickets: random(3, 9),
        overs: random(20, 48) + random(0, 5) / 10,
      },
      team2: {
        name: "South Africa",
        shortName: "SA",
        runs: random(100, 250),
        wickets: random(2, 7),
        overs: random(15, 42) + random(0, 5) / 10,
      },
    };
  }
}
