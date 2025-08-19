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
export class CricinfoScraper extends BaseScraper {
  constructor(
    selectorManager: SelectorManagerService,
    proxyManager: ProxyManagerService
  ) {
    super(SCRAPER_CONFIGS.cricinfo, selectorManager, proxyManager);
  }

  async scrapeMatch(matchId: string): Promise<ScraperResult> {
    return this.executeScraping(matchId);
  }

  protected async performScraping(
    matchId: string,
    userAgent: string,
    proxy: any
  ): Promise<ScrapedMatchData> {
    // In a real implementation, this would use a headless browser or HTTP client
    // For now, we'll simulate the scraping process

    this.logger.log(`Scraping match ${matchId} from ESPNcricinfo`);

    // Simulate network delay
    await this.sleep(1000 + Math.random() * 2000);

    // Simulate HTML document (in real implementation, this would be the actual page)
    const document = this.simulateCricinfoPage(matchId);

    // Extract team data
    const team1Data = await this.extractTeamData(document, "team1");
    const team2Data = await this.extractTeamData(document, "team2");

    // Extract commentary
    const commentary = await this.extractCommentary(document);

    // Create scraped data
    const data = this.createScrapedData(
      matchId,
      team1Data,
      team2Data,
      commentary
    );

    // Validate the data
    if (!this.validateScrapedData(data)) {
      throw new Error("Invalid data extracted from ESPNcricinfo");
    }

    return data;
  }

  private async extractTeamData(document: any, teamKey: string): Promise<any> {
    const selectors = this.config.selectors;

    // Extract team name
    const teamNameSelector =
      teamKey === "team1" ? selectors.team1Name : selectors.team2Name;
    const teamNameText = await this.extractElementText(
      document,
      teamNameSelector,
      [`.${teamKey} .team-name`, `.${teamKey} h3`, `.${teamKey} .name`]
    );

    const { name, shortName } = this.parseTeamName(teamNameText);

    // Extract score
    const scoreSelector =
      teamKey === "team1" ? selectors.team1Score : selectors.team2Score;
    const scoreText = await this.extractElementText(document, scoreSelector, [
      `.${teamKey} .score`,
      `.${teamKey} .runs`,
      `.${teamKey} [data-testid="score"]`,
    ]);

    const runs = this.parseNumber(scoreText);

    // Extract wickets
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

    // Extract overs
    const oversSelector =
      teamKey === "team1" ? selectors.team1Overs : selectors.team2Overs;
    const oversText = await this.extractElementText(document, oversSelector, [
      `.${teamKey} .overs`,
      `.${teamKey} .over-count`,
      `.${teamKey} [data-testid="overs"]`,
    ]);

    const overs = this.parseOvers(oversText);

    return {
      name,
      shortName,
      runs,
      wickets,
      overs,
    };
  }

  private async extractCommentary(document: any): Promise<string[]> {
    const commentary: string[] = [];

    try {
      // Extract commentary elements
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

  private simulateCricinfoPage(matchId: string): any {
    // Simulate a DOM-like structure for testing
    // In real implementation, this would be the actual HTML document

    const mockDocument = {
      querySelector: (selector: string) => {
        // Simulate different selectors based on match ID
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
          return { textContent: "Great shot! That's a boundary." };
        }

        return null;
      },
      querySelectorAll: (selector: string) => {
        if (selector.includes("commentary")) {
          return [
            { textContent: "Excellent delivery by the bowler." },
            { textContent: "The batsman defends it well." },
            {
              textContent: "That's a single, good running between the wickets.",
            },
            { textContent: "The fielding has been exceptional today." },
            { textContent: "Another dot ball, building pressure." },
          ];
        }
        return [];
      },
    };

    return mockDocument;
  }

  private getMockMatchData(matchId: string): any {
    // Generate realistic mock data based on match ID
    const seed = matchId.charCodeAt(0) + matchId.charCodeAt(matchId.length - 1);
    const random = (min: number, max: number) => min + (seed % (max - min + 1));

    return {
      team1: {
        name: "India",
        shortName: "IND",
        runs: random(120, 280),
        wickets: random(2, 8),
        overs: random(15, 45) + random(0, 5) / 10,
      },
      team2: {
        name: "Australia",
        shortName: "AUS",
        runs: random(80, 220),
        wickets: random(1, 6),
        overs: random(10, 40) + random(0, 5) / 10,
      },
    };
  }
}
