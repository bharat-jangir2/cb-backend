import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { PlayerStats, PlayerStatsSchema } from "./schemas/player-stats.schema";
import { TeamStats, TeamStatsSchema } from "./schemas/team-stats.schema";
import { MatchStats, MatchStatsSchema } from "./schemas/match-stats.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlayerStats.name, schema: PlayerStatsSchema },
      { name: TeamStats.name, schema: TeamStatsSchema },
      { name: MatchStats.name, schema: MatchStatsSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
