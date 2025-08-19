import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScrapersController } from "./scrapers.controller";
import { SelectorManagementController } from "./controllers/selector-management.controller";
import { ScrapersService } from "./services/scrapers.service";
import { SourceManagerService } from "./services/source-manager.service";
import { DataValidationService } from "./services/data-validation.service";
import { SelectorManagerService } from "./services/selector-manager.service";
import { ProxyManagerService } from "./services/proxy-manager.service";
import { DynamicSelectorManagerService } from "./services/dynamic-selector-manager.service";
import { CricinfoScraper } from "./scrapers/cricinfo.scraper";
import { CricbuzzScraper } from "./scrapers/cricbuzz.scraper";
import { FlashscoreScraper } from "./scrapers/flashscore.scraper";
import { CrexScraper } from "./scrapers/crex.scraper";
import { MatchesModule } from "../matches/matches.module";
import { BallsModule } from "../balls/balls.module";
import { AgentsModule } from "../agents/agents.module";

@Module({
  imports: [ConfigModule, MatchesModule, BallsModule, AgentsModule],
  controllers: [ScrapersController, SelectorManagementController],
  providers: [
    ScrapersService,
    SourceManagerService,
    DataValidationService,
    SelectorManagerService,
    ProxyManagerService,
    DynamicSelectorManagerService,
    CricinfoScraper,
    CricbuzzScraper,
    FlashscoreScraper,
    CrexScraper,
  ],
  exports: [
    ScrapersService,
    SourceManagerService,
    DataValidationService,
    DynamicSelectorManagerService,
  ],
})
export class ScrapersModule {}
