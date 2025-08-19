import { Injectable, Logger } from "@nestjs/common";
import { ScraperConfig, SelectorUpdate } from "../interfaces/scraper.interface";
import { SCRAPER_CONFIGS, SCRAPING_SETTINGS } from "../config/scraper-config";

@Injectable()
export class SelectorManagerService {
  private readonly logger = new Logger(SelectorManagerService.name);
  private readonly selectorFailures: Map<string, Map<string, number>> =
    new Map();
  private readonly selectorUpdates: SelectorUpdate[] = [];

  constructor() {
    this.initializeFailureTracking();
  }

  private initializeFailureTracking(): void {
    Object.keys(SCRAPER_CONFIGS).forEach((sourceName) => {
      this.selectorFailures.set(sourceName, new Map());
    });
  }

  async recordSelectorFailure(
    sourceName: string,
    selector: string
  ): Promise<void> {
    const sourceFailures = this.selectorFailures.get(sourceName);
    if (!sourceFailures) {
      this.logger.warn(`Unknown source: ${sourceName}`);
      return;
    }

    const currentFailures = sourceFailures.get(selector) || 0;
    sourceFailures.set(selector, currentFailures + 1);

    this.logger.warn(
      `Selector failure recorded for ${sourceName}.${selector}: ${
        currentFailures + 1
      } failures`
    );

    // Check if we need to attempt auto-fix
    if (currentFailures + 1 >= SCRAPING_SETTINGS.selectorUpdateThreshold) {
      await this.attemptSelectorFix(sourceName, selector);
    }
  }

  async recordSelectorSuccess(
    sourceName: string,
    selector: string
  ): Promise<void> {
    const sourceFailures = this.selectorFailures.get(sourceName);
    if (sourceFailures) {
      sourceFailures.delete(selector);
      this.logger.debug(
        `Selector success recorded for ${sourceName}.${selector}, failures reset`
      );
    }
  }

  private async attemptSelectorFix(
    sourceName: string,
    selector: string
  ): Promise<void> {
    this.logger.warn(
      `Attempting to auto-fix selector: ${sourceName}.${selector}`
    );

    try {
      const config = SCRAPER_CONFIGS[sourceName];
      const oldSelector =
        config.selectors[selector as keyof typeof config.selectors];

      if (!oldSelector) {
        this.logger.error(`Unknown selector: ${selector}`);
        return;
      }

      // Try common selector variations
      const newSelector = await this.findAlternativeSelector(
        sourceName,
        selector,
        oldSelector
      );

      if (newSelector && newSelector !== oldSelector) {
        await this.updateSelector(
          sourceName,
          selector,
          oldSelector,
          newSelector,
          "Auto-fix attempt"
        );
        this.logger.log(
          `Successfully auto-fixed selector ${sourceName}.${selector}: ${oldSelector} -> ${newSelector}`
        );
      } else {
        this.logger.warn(
          `Could not auto-fix selector ${sourceName}.${selector}, manual update required`
        );
        await this.recordManualUpdateRequired(
          sourceName,
          selector,
          oldSelector
        );
      }
    } catch (error) {
      this.logger.error(
        `Error attempting selector fix for ${sourceName}.${selector}:`,
        error
      );
    }
  }

  private async findAlternativeSelector(
    sourceName: string,
    selectorName: string,
    currentSelector: string
  ): Promise<string | null> {
    // Common selector variations to try
    const variations = this.generateSelectorVariations(currentSelector);

    for (const variation of variations) {
      try {
        // Test the variation (in a real implementation, this would test against the actual page)
        const isValid = await this.testSelector(sourceName, variation);
        if (isValid) {
          return variation;
        }
      } catch (error) {
        // Continue to next variation
      }
    }

    return null;
  }

  private generateSelectorVariations(selector: string): string[] {
    const variations: string[] = [];

    // Try different CSS selector strategies
    if (selector.startsWith(".")) {
      // Class selector - try ID, attribute, or tag selectors
      const className = selector.substring(1);
      variations.push(`#${className}`);
      variations.push(`[class*="${className}"]`);
      variations.push(`[class~="${className}"]`);
      variations.push(`div.${className}`);
      variations.push(`span.${className}`);
    } else if (selector.startsWith("#")) {
      // ID selector - try class or attribute selectors
      const idName = selector.substring(1);
      variations.push(`.${idName}`);
      variations.push(`[id*="${idName}"]`);
      variations.push(`div#${idName}`);
    } else if (selector.includes("[")) {
      // Attribute selector - try simpler variations
      const baseSelector = selector.split("[")[0];
      if (baseSelector) {
        variations.push(baseSelector);
        variations.push(`.${baseSelector.replace(/[^a-zA-Z0-9]/g, "")}`);
      }
    } else {
      // Tag selector - try with classes
      variations.push(`.${selector.replace(/[^a-zA-Z0-9]/g, "")}`);
      variations.push(`[data-testid*="${selector}"]`);
      variations.push(`[data-cy*="${selector}"]`);
    }

    // Try common naming patterns
    const commonPatterns = [
      selector.replace(/[-_]/g, ""),
      selector.replace(/[-_]/g, "-"),
      selector.replace(/[-_]/g, "_"),
      selector.toLowerCase(),
      selector.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`),
    ];

    variations.push(...commonPatterns);

    return variations;
  }

  private async testSelector(
    sourceName: string,
    selector: string
  ): Promise<boolean> {
    // In a real implementation, this would test the selector against the actual page
    // For now, we'll simulate testing with some basic validation

    // Simulate testing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Basic validation - selector should be valid CSS
    if (!selector || selector.length < 2) {
      return false;
    }

    // Check for common invalid patterns
    if (selector.includes("undefined") || selector.includes("null")) {
      return false;
    }

    // Simulate 70% success rate for testing
    return Math.random() > 0.3;
  }

  private async updateSelector(
    sourceName: string,
    selectorName: string,
    oldValue: string,
    newValue: string,
    reason: string
  ): Promise<void> {
    const update: SelectorUpdate = {
      selector: `${sourceName}.${selectorName}`,
      oldValue,
      newValue,
      reason,
      timestamp: new Date(),
      success: true,
    };

    this.selectorUpdates.push(update);

    // Update the config (in a real implementation, this would persist to database)
    const config = SCRAPER_CONFIGS[sourceName];
    if (
      config &&
      config.selectors[selectorName as keyof typeof config.selectors]
    ) {
      (config.selectors as any)[selectorName] = newValue;
    }

    // Reset failure count
    const sourceFailures = this.selectorFailures.get(sourceName);
    if (sourceFailures) {
      sourceFailures.delete(selectorName);
    }

    this.logger.log(
      `Selector updated: ${update.selector} (${oldValue} -> ${newValue})`
    );
  }

  private async recordManualUpdateRequired(
    sourceName: string,
    selectorName: string,
    currentSelector: string
  ): Promise<void> {
    const update: SelectorUpdate = {
      selector: `${sourceName}.${selectorName}`,
      oldValue: currentSelector,
      newValue: currentSelector,
      reason: "Manual update required - auto-fix failed",
      timestamp: new Date(),
      success: false,
    };

    this.selectorUpdates.push(update);

    this.logger.error(
      `Manual selector update required for ${sourceName}.${selectorName}: ${currentSelector}`
    );
  }

  async getSelectorFailures(
    sourceName?: string
  ): Promise<Map<string, number>[]> {
    if (sourceName) {
      const failures = this.selectorFailures.get(sourceName);
      return failures ? [failures] : [];
    }

    return Array.from(this.selectorFailures.values());
  }

  async getSelectorUpdates(
    sourceName?: string,
    limit: number = 100
  ): Promise<SelectorUpdate[]> {
    let updates = this.selectorUpdates;

    if (sourceName) {
      updates = updates.filter((update) =>
        update.selector.startsWith(sourceName)
      );
    }

    return updates.slice(-limit);
  }

  async resetSelectorFailures(
    sourceName?: string,
    selector?: string
  ): Promise<void> {
    if (sourceName && selector) {
      const sourceFailures = this.selectorFailures.get(sourceName);
      if (sourceFailures) {
        sourceFailures.delete(selector);
        this.logger.log(`Reset failures for ${sourceName}.${selector}`);
      }
    } else if (sourceName) {
      const sourceFailures = this.selectorFailures.get(sourceName);
      if (sourceFailures) {
        sourceFailures.clear();
        this.logger.log(`Reset all failures for ${sourceName}`);
      }
    } else {
      this.selectorFailures.forEach((failures, name) => {
        failures.clear();
      });
      this.logger.log("Reset all selector failures");
    }
  }

  async getSelectorHealth(sourceName: string): Promise<{
    totalSelectors: number;
    failingSelectors: number;
    successRate: number;
    lastUpdate: Date | null;
  }> {
    const config = SCRAPER_CONFIGS[sourceName];
    if (!config) {
      throw new Error(`Unknown source: ${sourceName}`);
    }

    const sourceFailures = this.selectorFailures.get(sourceName);
    const totalSelectors = Object.keys(config.selectors).length;
    const failingSelectors = sourceFailures ? sourceFailures.size : 0;
    const successRate =
      totalSelectors > 0
        ? (totalSelectors - failingSelectors) / totalSelectors
        : 1;

    const lastUpdate =
      this.selectorUpdates
        .filter((update) => update.selector.startsWith(sourceName))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
        ?.timestamp || null;

    return {
      totalSelectors,
      failingSelectors,
      successRate,
      lastUpdate,
    };
  }

  async validateSelector(
    sourceName: string,
    selectorName: string
  ): Promise<{
    isValid: boolean;
    currentValue: string;
    failureCount: number;
    lastUpdate: Date | null;
  }> {
    const config = SCRAPER_CONFIGS[sourceName];
    if (!config) {
      throw new Error(`Unknown source: ${sourceName}`);
    }

    const currentValue =
      config.selectors[selectorName as keyof typeof config.selectors];
    const sourceFailures = this.selectorFailures.get(sourceName);
    const failureCount = sourceFailures?.get(selectorName) || 0;

    const lastUpdate =
      this.selectorUpdates
        .filter((update) => update.selector === `${sourceName}.${selectorName}`)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
        ?.timestamp || null;

    return {
      isValid: failureCount < SCRAPING_SETTINGS.selectorUpdateThreshold,
      currentValue: currentValue || "",
      failureCount,
      lastUpdate,
    };
  }
}
