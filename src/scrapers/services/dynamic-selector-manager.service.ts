import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

export interface SelectorConfig {
  version: string;
  lastUpdated: string;
  sources: {
    [sourceKey: string]: {
      name: string;
      baseUrl: string;
      selectors: {
        [fieldName: string]: string;
      };
      fallbackSelectors?: {
        [fieldName: string]: string[];
      };
    };
  };
  globalFallbacks: {
    [fieldType: string]: string[];
  };
  autoDetection: {
    enabled: boolean;
    fuzzyMatchThreshold: number;
    maxAttempts: number;
    searchPatterns: {
      [fieldType: string]: string[];
    };
  };
}

export interface SelectorFailure {
  source: string;
  field: string;
  url: string;
  timestamp: Date;
  originalSelector: string;
  attempts: string[];
  suggestedFix?: string;
}

@Injectable()
export class DynamicSelectorManagerService {
  private readonly logger = new Logger(DynamicSelectorManagerService.name);
  private config: SelectorConfig;
  private configPath: string;
  private selectorFailures: SelectorFailure[] = [];
  private lastConfigLoad: Date;
  private configWatcher: fs.FSWatcher | null = null;

  constructor() {
    this.configPath = path.join(
      process.cwd(),
      "src/scrapers/config/selectors.json"
    );
    this.loadConfig();
    this.startConfigWatcher();
  }

  private loadConfig(): void {
    try {
      const configData = fs.readFileSync(this.configPath, "utf8");
      this.config = JSON.parse(configData);
      this.lastConfigLoad = new Date();
      this.logger.log(`Loaded selector config version ${this.config.version}`);
    } catch (error) {
      this.logger.error("Failed to load selector config:", error);
      throw new Error("Cannot load selector configuration");
    }
  }

  private startConfigWatcher(): void {
    try {
      this.configWatcher = fs.watch(this.configPath, (eventType) => {
        if (eventType === "change") {
          this.logger.log("Selector config file changed, reloading...");
          setTimeout(() => {
            this.loadConfig();
          }, 1000); // Small delay to ensure file is fully written
        }
      });
      this.logger.log("Started watching selector config file for changes");
    } catch (error) {
      this.logger.warn("Failed to start config watcher:", error);
    }
  }

  getSelector(source: string, field: string): string | null {
    const sourceConfig = this.config.sources[source];
    if (!sourceConfig) {
      this.logger.warn(`Source ${source} not found in config`);
      return null;
    }

    const selector = sourceConfig.selectors[field];
    if (!selector) {
      this.logger.warn(`Field ${field} not found for source ${source}`);
      return null;
    }

    return selector;
  }

  getFallbackSelectors(source: string, field: string): string[] {
    const sourceConfig = this.config.sources[source];
    if (!sourceConfig?.fallbackSelectors?.[field]) {
      return [];
    }

    return sourceConfig.fallbackSelectors[field];
  }

  getGlobalFallbacks(fieldType: string): string[] {
    return this.config.globalFallbacks[fieldType] || [];
  }

  getAllSelectorsForSource(source: string): { [field: string]: string } | null {
    const sourceConfig = this.config.sources[source];
    return sourceConfig?.selectors || null;
  }

  getSourceConfig(source: string): any {
    return this.config.sources[source] || null;
  }

  isAutoDetectionEnabled(): boolean {
    return this.config.autoDetection.enabled;
  }

  getFuzzyMatchThreshold(): number {
    return this.config.autoDetection.fuzzyMatchThreshold;
  }

  getMaxAttempts(): number {
    return this.config.autoDetection.maxAttempts;
  }

  getSearchPatterns(fieldType: string): string[] {
    return this.config.autoDetection.searchPatterns[fieldType] || [];
  }

  recordSelectorFailure(
    source: string,
    field: string,
    url: string,
    originalSelector: string,
    attempts: string[] = []
  ): void {
    const failure: SelectorFailure = {
      source,
      field,
      url,
      timestamp: new Date(),
      originalSelector,
      attempts,
    };

    this.selectorFailures.push(failure);
    this.logger.warn(
      `Selector failure recorded: ${source}.${field} - ${originalSelector}`
    );

    // Try auto-detection if enabled
    if (this.isAutoDetectionEnabled()) {
      this.attemptAutoDetection(failure);
    }
  }

  private async attemptAutoDetection(failure: SelectorFailure): Promise<void> {
    try {
      this.logger.log(
        `Attempting auto-detection for ${failure.source}.${failure.field}`
      );

      // Get search patterns for this field type
      const fieldType = this.getFieldType(failure.field);
      const searchPatterns = this.getSearchPatterns(fieldType);

      // Try to find a matching element using fuzzy search
      const suggestedSelector = await this.findFuzzyMatch(
        failure.url,
        searchPatterns,
        fieldType
      );

      if (suggestedSelector) {
        failure.suggestedFix = suggestedSelector;
        this.logger.log(
          `Auto-detection found potential fix: ${suggestedSelector}`
        );

        // Update config in memory (but not file yet)
        this.updateSelectorInMemory(
          failure.source,
          failure.field,
          suggestedSelector
        );

        // Flag for human verification
        this.flagForVerification(failure);
      }
    } catch (error) {
      this.logger.error("Auto-detection failed:", error);
    }
  }

  private getFieldType(field: string): string {
    if (field.includes("Name")) return "teamName";
    if (field.includes("Score")) return "score";
    if (field.includes("Wickets")) return "wickets";
    if (field.includes("Overs")) return "overs";
    return "general";
  }

  private async findFuzzyMatch(
    url: string,
    searchPatterns: string[],
    fieldType: string
  ): Promise<string | null> {
    // In a real implementation, this would:
    // 1. Fetch the page
    // 2. Parse the DOM
    // 3. Search for elements matching the patterns
    // 4. Use fuzzy matching to find the best candidate
    // 5. Return the selector for the best match

    // For now, we'll simulate this process
    this.logger.debug(
      `Searching for ${fieldType} with patterns: ${searchPatterns.join(", ")}`
    );

    // Simulate finding a match
    const possibleSelectors = [
      `[class*="${searchPatterns[0]}"]`,
      `[data-${fieldType}]`,
      `.${fieldType}-element`,
      `#${fieldType}-container`,
    ];

    // Return a random selector as simulation
    return possibleSelectors[
      Math.floor(Math.random() * possibleSelectors.length)
    ];
  }

  private updateSelectorInMemory(
    source: string,
    field: string,
    newSelector: string
  ): void {
    if (this.config.sources[source]) {
      this.config.sources[source].selectors[field] = newSelector;
      this.logger.log(
        `Updated selector in memory: ${source}.${field} -> ${newSelector}`
      );
    }
  }

  private flagForVerification(failure: SelectorFailure): void {
    // In a real implementation, this would:
    // 1. Send notification to admin
    // 2. Log to database
    // 3. Create verification task
    this.logger.warn(
      `Selector change flagged for verification: ${failure.source}.${failure.field} -> ${failure.suggestedFix}`
    );
  }

  async updateSelector(
    source: string,
    field: string,
    newSelector: string,
    validate: boolean = true
  ): Promise<boolean> {
    try {
      if (validate) {
        // Validate the new selector
        const isValid = await this.validateSelector(newSelector);
        if (!isValid) {
          this.logger.error(`Invalid selector: ${newSelector}`);
          return false;
        }
      }

      // Update in memory
      this.updateSelectorInMemory(source, field, newSelector);

      // Update in file
      await this.saveConfigToFile();

      this.logger.log(`Selector updated: ${source}.${field} -> ${newSelector}`);
      return true;
    } catch (error) {
      this.logger.error("Failed to update selector:", error);
      return false;
    }
  }

  private async validateSelector(selector: string): Promise<boolean> {
    // Basic validation - check if it's a valid CSS selector
    try {
      // In a real implementation, this would use a CSS selector parser
      // For now, we'll do basic validation
      if (!selector || selector.length < 2) return false;
      if (selector.includes("undefined") || selector.includes("null"))
        return false;

      // Check for common invalid patterns
      const invalidPatterns = ["javascript:", "data:javascript", "vbscript:"];
      return !invalidPatterns.some((pattern) => selector.includes(pattern));
    } catch (error) {
      return false;
    }
  }

  private async saveConfigToFile(): Promise<void> {
    try {
      // Update timestamp
      this.config.lastUpdated = new Date().toISOString();

      // Write to file
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      this.logger.log("Selector config saved to file");
    } catch (error) {
      this.logger.error("Failed to save config to file:", error);
      throw error;
    }
  }

  getSelectorFailures(
    source?: string,
    field?: string,
    limit: number = 100
  ): SelectorFailure[] {
    let failures = this.selectorFailures;

    if (source) {
      failures = failures.filter((f) => f.source === source);
    }

    if (field) {
      failures = failures.filter((f) => f.field === field);
    }

    return failures.slice(-limit);
  }

  clearSelectorFailures(): void {
    this.selectorFailures = [];
    this.logger.log("Selector failures cleared");
  }

  getConfigVersion(): string {
    return this.config.version;
  }

  getLastConfigLoad(): Date {
    return this.lastConfigLoad;
  }

  getConfigStats(): {
    totalSources: number;
    totalSelectors: number;
    totalFailures: number;
    version: string;
    lastUpdated: string;
  } {
    const totalSources = Object.keys(this.config.sources).length;
    const totalSelectors = Object.values(this.config.sources).reduce(
      (sum, source) => sum + Object.keys(source.selectors).length,
      0
    );

    return {
      totalSources,
      totalSelectors,
      totalFailures: this.selectorFailures.length,
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
    };
  }

  onModuleDestroy(): void {
    if (this.configWatcher) {
      this.configWatcher.close();
      this.logger.log("Config watcher closed");
    }
  }
}
