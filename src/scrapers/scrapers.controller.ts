import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { ScrapersService } from "./services/scrapers.service";
import { SourceManagerService } from "./services/source-manager.service";
import { DataValidationService } from "./services/data-validation.service";
import { SelectorManagerService } from "./services/selector-manager.service";
import { ProxyManagerService } from "./services/proxy-manager.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("scrapers")
@Controller("api/scrapers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScrapersController {
  constructor(
    private readonly scrapersService: ScrapersService,
    private readonly sourceManager: SourceManagerService,
    private readonly dataValidation: DataValidationService,
    private readonly selectorManager: SelectorManagerService,
    private readonly proxyManager: ProxyManagerService
  ) {}

  @Post("scrape/:matchId")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Scrape match data from external sources" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match data scraped successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to scrape match data" })
  async scrapeMatch(@Param("matchId") matchId: string) {
    return this.scrapersService.scrapeMatchData(matchId);
  }

  @Get("status")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get scraping system status" })
  @ApiResponse({
    status: 200,
    description: "System status retrieved successfully",
  })
  async getSystemStatus() {
    return this.scrapersService.getSystemStatus();
  }

  @Get("metrics")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get scraping metrics" })
  @ApiResponse({
    status: 200,
    description: "Metrics retrieved successfully",
  })
  async getMetrics() {
    return this.scrapersService.getMetrics();
  }

  @Get("sources")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get all source statuses" })
  @ApiResponse({
    status: 200,
    description: "Source statuses retrieved successfully",
  })
  async getAllSourceStatuses() {
    return this.sourceManager.getAllSourceStatuses();
  }

  @Get("sources/failover-history")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get failover history" })
  @ApiResponse({
    status: 200,
    description: "Failover history retrieved successfully",
  })
  async getFailoverHistory() {
    return this.sourceManager.getFailoverHistory();
  }

  @Post("sources/:sourceName/disable")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Disable a source" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiResponse({
    status: 200,
    description: "Source disabled successfully",
  })
  async disableSource(@Param("sourceName") sourceName: string) {
    await this.sourceManager.disableSource(sourceName);
    return { message: `Source ${sourceName} disabled successfully` };
  }

  @Post("sources/:sourceName/enable")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Enable a source" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiResponse({
    status: 200,
    description: "Source enabled successfully",
  })
  async enableSource(@Param("sourceName") sourceName: string) {
    await this.sourceManager.enableSource(sourceName);
    return { message: `Source ${sourceName} enabled successfully` };
  }

  @Post("sources/:sourceName/reset")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Reset source statistics" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiResponse({
    status: 200,
    description: "Source statistics reset successfully",
  })
  async resetSourceStats(@Param("sourceName") sourceName: string) {
    await this.sourceManager.resetSourceStats(sourceName);
    return { message: `Source ${sourceName} statistics reset successfully` };
  }

  @Post("test/:sourceName/:matchId")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Test a specific source" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Source test completed",
  })
  async testSource(
    @Param("sourceName") sourceName: string,
    @Param("matchId") matchId: string
  ) {
    return this.scrapersService.testSource(sourceName, matchId);
  }

  @Post("rotate")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Force source rotation" })
  @ApiResponse({
    status: 200,
    description: "Source rotation completed",
  })
  async forceRotation() {
    await this.scrapersService.forceSourceRotation();
    return { message: "Source rotation completed" };
  }

  @Get("selectors/:sourceName")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get selector health for a source" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiResponse({
    status: 200,
    description: "Selector health retrieved successfully",
  })
  async getSelectorHealth(@Param("sourceName") sourceName: string) {
    return this.selectorManager.getSelectorHealth(sourceName);
  }

  @Get("selectors/:sourceName/updates")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get selector updates for a source" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiResponse({
    status: 200,
    description: "Selector updates retrieved successfully",
  })
  async getSelectorUpdates(@Param("sourceName") sourceName: string) {
    return this.selectorManager.getSelectorUpdates(sourceName);
  }

  @Post("selectors/:sourceName/reset")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Reset selector failures for a source" })
  @ApiParam({ name: "sourceName", description: "Source name" })
  @ApiResponse({
    status: 200,
    description: "Selector failures reset successfully",
  })
  async resetSelectorFailures(@Param("sourceName") sourceName: string) {
    await this.selectorManager.resetSelectorFailures(sourceName);
    return {
      message: `Selector failures for ${sourceName} reset successfully`,
    };
  }

  @Get("proxies")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get proxy statistics" })
  @ApiResponse({
    status: 200,
    description: "Proxy statistics retrieved successfully",
  })
  async getProxyStats() {
    return this.proxyManager.getProxyStats();
  }

  @Get("proxies/health")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get proxy health status" })
  @ApiResponse({
    status: 200,
    description: "Proxy health retrieved successfully",
  })
  async getProxyHealth() {
    return this.proxyManager.getProxyHealth();
  }

  @Post("proxies/rotate")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Force proxy rotation" })
  @ApiResponse({
    status: 200,
    description: "Proxy rotation completed",
  })
  async forceProxyRotation() {
    await this.proxyManager.forceRotation();
    return { message: "Proxy rotation completed" };
  }

  @Post("proxies/reset")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Reset proxy statistics" })
  @ApiResponse({
    status: 200,
    description: "Proxy statistics reset successfully",
  })
  async resetProxyStats() {
    await this.proxyManager.resetProxyStats();
    return { message: "Proxy statistics reset successfully" };
  }

  @Post("validate")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Validate scraped data" })
  @ApiResponse({
    status: 200,
    description: "Data validation completed",
  })
  async validateData(@Body() data: any) {
    // This would validate the provided data against validation rules
    const validation = await this.dataValidation.validateData(
      data.primaryData,
      data.backupData
    );
    return validation;
  }

  @Get("health")
  @ApiOperation({ summary: "Get overall scraping system health" })
  @ApiResponse({
    status: 200,
    description: "System health retrieved successfully",
  })
  async getSystemHealth() {
    const [systemStatus, sourceHealth, proxyHealth, selectorHealth] =
      await Promise.all([
        this.scrapersService.getSystemStatus(),
        this.sourceManager.getSystemHealth(),
        this.proxyManager.getProxyHealth(),
        this.selectorManager.getSelectorHealth("cricinfo"), // Get health for primary source
      ]);

    const overallHealth = {
      isHealthy:
        systemStatus.isHealthy &&
        sourceHealth.availableSources > 0 &&
        proxyHealth.isHealthy,
      system: systemStatus,
      sources: sourceHealth,
      proxies: proxyHealth,
      selectors: selectorHealth,
      timestamp: new Date(),
    };

    return overallHealth;
  }
}
