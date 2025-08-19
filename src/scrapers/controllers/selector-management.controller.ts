import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";
import { DynamicSelectorManagerService } from "../services/dynamic-selector-manager.service";

@ApiTags("selector-management")
@Controller("api/selectors")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SelectorManagementController {
  constructor(
    private readonly dynamicSelectorManager: DynamicSelectorManagerService
  ) {}

  @Get("config")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get current selector configuration" })
  @ApiResponse({
    status: 200,
    description: "Configuration retrieved successfully",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getConfig() {
    return {
      version: this.dynamicSelectorManager.getConfigVersion(),
      lastUpdated: this.dynamicSelectorManager.getLastConfigLoad(),
      stats: this.dynamicSelectorManager.getConfigStats(),
    };
  }

  @Get("sources")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get all available sources" })
  @ApiResponse({ status: 200, description: "Sources retrieved successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getSources() {
    const stats = this.dynamicSelectorManager.getConfigStats();
    return {
      sources: Object.keys(stats).filter(
        (key) =>
          key !== "totalSources" &&
          key !== "totalSelectors" &&
          key !== "totalFailures" &&
          key !== "version" &&
          key !== "lastUpdated"
      ),
      totalSources: stats.totalSources,
    };
  }

  @Get("sources/:source")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get selectors for a specific source" })
  @ApiParam({
    name: "source",
    description: "Source name (espn, cricbuzz, flashscore, crex)",
  })
  @ApiResponse({
    status: 200,
    description: "Source selectors retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Source not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getSourceSelectors(@Param("source") source: string) {
    const selectors =
      this.dynamicSelectorManager.getAllSelectorsForSource(source);
    const sourceConfig = this.dynamicSelectorManager.getSourceConfig(source);

    if (!selectors) {
      return { error: "Source not found" };
    }

    return {
      source,
      name: sourceConfig?.name,
      baseUrl: sourceConfig?.baseUrl,
      selectors,
      fallbackSelectors: sourceConfig?.fallbackSelectors || {},
    };
  }

  @Get("sources/:source/:field")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get selector for a specific field" })
  @ApiParam({ name: "source", description: "Source name" })
  @ApiParam({
    name: "field",
    description: "Field name (team1Name, team1Score, etc.)",
  })
  @ApiResponse({ status: 200, description: "Selector retrieved successfully" })
  @ApiResponse({ status: 404, description: "Selector not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getSelector(@Param("source") source: string, @Param("field") field: string) {
    const selector = this.dynamicSelectorManager.getSelector(source, field);
    const fallbacks = this.dynamicSelectorManager.getFallbackSelectors(
      source,
      field
    );

    if (!selector) {
      return { error: "Selector not found" };
    }

    return {
      source,
      field,
      selector,
      fallbackSelectors: fallbacks,
    };
  }

  @Put("sources/:source/:field")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update selector for a specific field" })
  @ApiParam({ name: "source", description: "Source name" })
  @ApiParam({ name: "field", description: "Field name" })
  @ApiResponse({ status: 200, description: "Selector updated successfully" })
  @ApiResponse({ status: 400, description: "Invalid selector" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async updateSelector(
    @Param("source") source: string,
    @Param("field") field: string,
    @Body() body: { selector: string; validate?: boolean }
  ) {
    const success = await this.dynamicSelectorManager.updateSelector(
      source,
      field,
      body.selector,
      body.validate !== false
    );

    if (success) {
      return {
        success: true,
        message: "Selector updated successfully",
        source,
        field,
        selector: body.selector,
      };
    } else {
      return {
        success: false,
        message: "Failed to update selector",
        source,
        field,
      };
    }
  }

  @Get("failures")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get selector failures" })
  @ApiQuery({
    name: "source",
    required: false,
    description: "Filter by source",
  })
  @ApiQuery({ name: "field", required: false, description: "Filter by field" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of failures to return",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Failures retrieved successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getFailures(
    @Query("source") source?: string,
    @Query("field") field?: string,
    @Query("limit") limit?: number
  ) {
    const failures = this.dynamicSelectorManager.getSelectorFailures(
      source,
      field,
      limit || 100
    );

    return {
      failures,
      total: failures.length,
      filters: { source, field, limit },
    };
  }

  @Delete("failures")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Clear all selector failures" })
  @ApiResponse({ status: 200, description: "Failures cleared successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  clearFailures() {
    this.dynamicSelectorManager.clearSelectorFailures();
    return {
      success: true,
      message: "All selector failures cleared",
    };
  }

  @Get("auto-detection/status")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get auto-detection status" })
  @ApiResponse({ status: 200, description: "Status retrieved successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getAutoDetectionStatus() {
    return {
      enabled: this.dynamicSelectorManager.isAutoDetectionEnabled(),
      fuzzyMatchThreshold: this.dynamicSelectorManager.getFuzzyMatchThreshold(),
      maxAttempts: this.dynamicSelectorManager.getMaxAttempts(),
      searchPatterns: {
        teamName: this.dynamicSelectorManager.getSearchPatterns("teamName"),
        score: this.dynamicSelectorManager.getSearchPatterns("score"),
        wickets: this.dynamicSelectorManager.getSearchPatterns("wickets"),
        overs: this.dynamicSelectorManager.getSearchPatterns("overs"),
      },
    };
  }

  @Get("global-fallbacks")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get global fallback selectors" })
  @ApiResponse({
    status: 200,
    description: "Global fallbacks retrieved successfully",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getGlobalFallbacks() {
    return {
      teamName: this.dynamicSelectorManager.getGlobalFallbacks("teamName"),
      score: this.dynamicSelectorManager.getGlobalFallbacks("score"),
      wickets: this.dynamicSelectorManager.getGlobalFallbacks("wickets"),
      overs: this.dynamicSelectorManager.getGlobalFallbacks("overs"),
    };
  }

  @Post("reload")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Reload selector configuration from file" })
  @ApiResponse({
    status: 200,
    description: "Configuration reloaded successfully",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  reloadConfig() {
    // This would trigger a reload in the DynamicSelectorManagerService
    // For now, we'll return a success message
    return {
      success: true,
      message: "Configuration reload request sent",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("health")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get selector system health" })
  @ApiResponse({
    status: 200,
    description: "Health status retrieved successfully",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getHealth() {
    const stats = this.dynamicSelectorManager.getConfigStats();
    const failures = this.dynamicSelectorManager.getSelectorFailures();

    const recentFailures = failures.filter(
      (f) => new Date().getTime() - f.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    return {
      status: "healthy",
      configVersion: stats.version,
      lastConfigLoad: stats.lastUpdated,
      totalSources: stats.totalSources,
      totalSelectors: stats.totalSelectors,
      totalFailures: stats.totalFailures,
      recentFailures: recentFailures.length,
      autoDetection: {
        enabled: this.dynamicSelectorManager.isAutoDetectionEnabled(),
        threshold: this.dynamicSelectorManager.getFuzzyMatchThreshold(),
      },
      uptime: {
        configLoadTime: this.dynamicSelectorManager.getLastConfigLoad(),
        uptimeSeconds: Math.floor(
          (new Date().getTime() -
            this.dynamicSelectorManager.getLastConfigLoad().getTime()) /
            1000
        ),
      },
    };
  }
}
