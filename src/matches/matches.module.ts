import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MatchesController } from "./matches.controller";
import { ScorecardController } from "./scorecard.controller";
import { MatchesService } from "./matches.service";
import { ScorecardService } from "./scorecard.service";
import { ScorecardGateway } from "./scorecard.gateway";
import { Match, MatchSchema } from "./schemas/match.schema";
import { Innings, InningsSchema } from "./schemas/innings.schema";
import { Ball, BallSchema } from "./schemas/ball.schema";
import {
  PlayerMatchStats,
  PlayerMatchStatsSchema,
} from "./schemas/player-match-stats.schema";
import { Partnership, PartnershipSchema } from "./schemas/partnership.schema";
import { MatchEvent, MatchEventSchema } from "./schemas/match-event.schema";
import { DRSReview, DRSReviewSchema } from "./schemas/drs-review.schema";
import { Scorecard, ScorecardSchema } from "./schemas/scorecard.schema";
import { Player, PlayerSchema } from "../players/schemas/player.schema";
import { TeamsModule } from "../teams/teams.module";
import { PlayersModule } from "../players/players.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Innings.name, schema: InningsSchema },
      { name: Ball.name, schema: BallSchema },
      { name: PlayerMatchStats.name, schema: PlayerMatchStatsSchema },
      { name: Partnership.name, schema: PartnershipSchema },
      { name: MatchEvent.name, schema: MatchEventSchema },
      { name: DRSReview.name, schema: DRSReviewSchema },
      { name: Scorecard.name, schema: ScorecardSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
    TeamsModule,
    PlayersModule,
  ],
  controllers: [MatchesController, ScorecardController],
  providers: [MatchesService, ScorecardService, ScorecardGateway],
  exports: [MatchesService, ScorecardService, ScorecardGateway],
})
export class MatchesModule {}
