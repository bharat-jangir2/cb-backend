import { Injectable, Logger } from "@nestjs/common";
import {
  ScrapedMatchData,
  ValidationResult,
} from "../interfaces/scraper.interface";
import { SCRAPING_SETTINGS } from "../config/scraper-config";

@Injectable()
export class DataValidationService {
  private readonly logger = new Logger(DataValidationService.name);

  async validateData(
    primaryData: ScrapedMatchData,
    backupData?: ScrapedMatchData
  ): Promise<ValidationResult> {
    const crossCheckResults: ValidationResult["crossCheckResults"] = {};
    crossCheckResults[primaryData.source] = {
      data: primaryData,
      reliability: primaryData.reliability,
    };

    if (backupData) {
      crossCheckResults[backupData.source] = {
        data: backupData,
        reliability: backupData.reliability,
      };
    }

    // If no backup data, validate primary data internally
    if (!backupData) {
      return this.validateSingleSource(primaryData);
    }

    // Cross-check data from multiple sources
    return this.crossCheckData(primaryData, backupData, crossCheckResults);
  }

  private validateSingleSource(data: ScrapedMatchData): ValidationResult {
    const discrepancies: string[] = [];
    let confidence = data.reliability;

    // Validate basic data structure
    if (!data.teams?.team1?.name || !data.teams?.team2?.name) {
      discrepancies.push("Missing team names");
      confidence *= 0.5;
    }

    if (data.score.team1.runs < 0 || data.score.team2.runs < 0) {
      discrepancies.push("Negative runs detected");
      confidence *= 0.3;
    }

    if (data.score.team1.wickets > 10 || data.score.team2.wickets > 10) {
      discrepancies.push("Invalid wicket count");
      confidence *= 0.2;
    }

    if (data.score.team1.overs < 0 || data.score.team2.overs < 0) {
      discrepancies.push("Negative overs detected");
      confidence *= 0.3;
    }

    // Check for unrealistic run rates
    if (data.score.team1.overs > 0) {
      const runRate = data.score.team1.runs / data.score.team1.overs;
      if (runRate > 20) {
        discrepancies.push("Unrealistic run rate for team 1");
        confidence *= 0.7;
      }
    }

    if (data.score.team2.overs > 0) {
      const runRate = data.score.team2.runs / data.score.team2.overs;
      if (runRate > 20) {
        discrepancies.push("Unrealistic run rate for team 2");
        confidence *= 0.7;
      }
    }

    // Check timestamp freshness
    const timeSinceUpdate = Date.now() - data.timestamp.getTime();
    if (timeSinceUpdate > 30000) {
      // 30 seconds
      discrepancies.push("Data is stale");
      confidence *= 0.8;
    }

    return {
      isValid: confidence >= SCRAPING_SETTINGS.validationThreshold,
      confidence,
      discrepancies,
      recommendedSource: data.source,
      crossCheckResults: {
        [data.source]: {
          data,
          reliability: data.reliability,
        },
      },
    };
  }

  private crossCheckData(
    primaryData: ScrapedMatchData,
    backupData: ScrapedMatchData,
    crossCheckResults: ValidationResult["crossCheckResults"]
  ): ValidationResult {
    const discrepancies: string[] = [];
    let confidence = 0;

    // Compare team names
    if (
      primaryData.teams.team1.name !== backupData.teams.team1.name ||
      primaryData.teams.team2.name !== backupData.teams.team2.name
    ) {
      discrepancies.push("Team name mismatch between sources");
    }

    // Compare scores with tolerance
    const scoreTolerance = 5; // Allow 5 run difference
    const wicketTolerance = 1; // Allow 1 wicket difference
    const overTolerance = 0.5; // Allow 0.5 over difference

    const runsDiff1 = Math.abs(
      primaryData.score.team1.runs - backupData.score.team1.runs
    );
    const runsDiff2 = Math.abs(
      primaryData.score.team2.runs - backupData.score.team2.runs
    );
    const wicketsDiff1 = Math.abs(
      primaryData.score.team1.wickets - backupData.score.team1.wickets
    );
    const wicketsDiff2 = Math.abs(
      primaryData.score.team2.wickets - backupData.score.team2.wickets
    );
    const oversDiff1 = Math.abs(
      primaryData.score.team1.overs - backupData.score.team1.overs
    );
    const oversDiff2 = Math.abs(
      primaryData.score.team2.overs - backupData.score.team2.overs
    );

    if (runsDiff1 > scoreTolerance) {
      discrepancies.push(
        `Team 1 runs differ by ${runsDiff1} (${primaryData.score.team1.runs} vs ${backupData.score.team1.runs})`
      );
    }

    if (runsDiff2 > scoreTolerance) {
      discrepancies.push(
        `Team 2 runs differ by ${runsDiff2} (${primaryData.score.team2.runs} vs ${backupData.score.team2.runs})`
      );
    }

    if (wicketsDiff1 > wicketTolerance) {
      discrepancies.push(
        `Team 1 wickets differ by ${wicketsDiff1} (${primaryData.score.team1.wickets} vs ${backupData.score.team1.wickets})`
      );
    }

    if (wicketsDiff2 > wicketTolerance) {
      discrepancies.push(
        `Team 2 wickets differ by ${wicketsDiff2} (${primaryData.score.team2.wickets} vs ${backupData.score.team2.wickets})`
      );
    }

    if (oversDiff1 > overTolerance) {
      discrepancies.push(
        `Team 1 overs differ by ${oversDiff1} (${primaryData.score.team1.overs} vs ${backupData.score.team1.overs})`
      );
    }

    if (oversDiff2 > overTolerance) {
      discrepancies.push(
        `Team 2 overs differ by ${oversDiff2} (${primaryData.score.team2.overs} vs ${backupData.score.team2.overs})`
      );
    }

    // Calculate confidence based on agreement and source reliability
    const agreementScore = this.calculateAgreementScore(
      primaryData,
      backupData
    );
    const reliabilityScore =
      (primaryData.reliability + backupData.reliability) / 2;
    confidence = (agreementScore + reliabilityScore) / 2;

    // Determine recommended source
    const recommendedSource = this.determineRecommendedSource(
      primaryData,
      backupData
    );

    return {
      isValid: confidence >= SCRAPING_SETTINGS.validationThreshold,
      confidence,
      discrepancies,
      recommendedSource,
      crossCheckResults,
    };
  }

  private calculateAgreementScore(
    data1: ScrapedMatchData,
    data2: ScrapedMatchData
  ): number {
    let agreementPoints = 0;
    const totalPoints = 6; // Number of comparison points

    // Compare runs
    if (Math.abs(data1.score.team1.runs - data2.score.team1.runs) <= 5)
      agreementPoints++;
    if (Math.abs(data1.score.team2.runs - data2.score.team2.runs) <= 5)
      agreementPoints++;

    // Compare wickets
    if (Math.abs(data1.score.team1.wickets - data2.score.team1.wickets) <= 1)
      agreementPoints++;
    if (Math.abs(data1.score.team2.wickets - data2.score.team2.wickets) <= 1)
      agreementPoints++;

    // Compare overs
    if (Math.abs(data1.score.team1.overs - data2.score.team1.overs) <= 0.5)
      agreementPoints++;
    if (Math.abs(data1.score.team2.overs - data2.score.team2.overs) <= 0.5)
      agreementPoints++;

    return agreementPoints / totalPoints;
  }

  private determineRecommendedSource(
    data1: ScrapedMatchData,
    data2: ScrapedMatchData
  ): string {
    // Prefer the source with more recent timestamp
    if (data1.timestamp > data2.timestamp) {
      return data1.source;
    } else if (data2.timestamp > data1.timestamp) {
      return data2.source;
    }

    // If timestamps are equal, prefer higher reliability
    if (data1.reliability > data2.reliability) {
      return data1.source;
    } else {
      return data2.source;
    }
  }

  async validateMultipleSources(
    dataArray: ScrapedMatchData[]
  ): Promise<ValidationResult> {
    if (dataArray.length === 0) {
      throw new Error("No data to validate");
    }

    if (dataArray.length === 1) {
      return this.validateSingleSource(dataArray[0]);
    }

    // Sort by reliability and timestamp
    const sortedData = dataArray.sort((a, b) => {
      if (a.reliability !== b.reliability) {
        return b.reliability - a.reliability;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    const primaryData = sortedData[0];
    const backupData = sortedData[1];

    const crossCheckResults: ValidationResult["crossCheckResults"] = {};
    dataArray.forEach((data) => {
      crossCheckResults[data.source] = {
        data,
        reliability: data.reliability,
      };
    });

    return this.crossCheckData(primaryData, backupData, crossCheckResults);
  }

  async detectAnomalies(data: ScrapedMatchData): Promise<string[]> {
    const anomalies: string[] = [];

    // Check for impossible cricket scenarios
    if (data.score.team1.wickets === 10 && data.score.team1.overs < 50) {
      // Team all out but innings not complete
      if (data.score.team2.runs === 0) {
        anomalies.push("Team 1 all out but team 2 hasn't batted yet");
      }
    }

    if (data.score.team2.wickets === 10 && data.score.team2.overs < 50) {
      // Team all out but innings not complete
      if (data.score.team1.runs === 0) {
        anomalies.push("Team 2 all out but team 1 hasn't batted yet");
      }
    }

    // Check for unrealistic scoring patterns
    if (data.score.team1.overs > 0) {
      const runRate = data.score.team1.runs / data.score.team1.overs;
      if (runRate > 15) {
        anomalies.push("Very high run rate for team 1");
      }
    }

    if (data.score.team2.overs > 0) {
      const runRate = data.score.team2.runs / data.score.team2.overs;
      if (runRate > 15) {
        anomalies.push("Very high run rate for team 2");
      }
    }

    // Check for impossible over counts
    if (data.score.team1.overs > 50 || data.score.team2.overs > 50) {
      anomalies.push("Over count exceeds maximum possible");
    }

    // Check for negative values
    if (data.score.team1.runs < 0 || data.score.team2.runs < 0) {
      anomalies.push("Negative runs detected");
    }

    if (data.score.team1.wickets < 0 || data.score.team2.wickets < 0) {
      anomalies.push("Negative wickets detected");
    }

    if (data.score.team1.overs < 0 || data.score.team2.overs < 0) {
      anomalies.push("Negative overs detected");
    }

    return anomalies;
  }

  async calculateDataQualityScore(data: ScrapedMatchData): Promise<number> {
    let score = data.reliability;

    // Penalize for missing data
    if (!data.teams.team1.name || !data.teams.team2.name) {
      score *= 0.8;
    }

    if (!data.commentary || data.commentary.length === 0) {
      score *= 0.9;
    }

    // Penalize for stale data
    const timeSinceUpdate = Date.now() - data.timestamp.getTime();
    if (timeSinceUpdate > 60000) {
      // 1 minute
      score *= 0.7;
    } else if (timeSinceUpdate > 30000) {
      // 30 seconds
      score *= 0.9;
    }

    // Check for anomalies
    const anomalies = await this.detectAnomalies(data);
    if (anomalies.length > 0) {
      score *= Math.max(0.5, 1 - anomalies.length * 0.1);
    }

    return Math.max(0, Math.min(1, score));
  }
}
