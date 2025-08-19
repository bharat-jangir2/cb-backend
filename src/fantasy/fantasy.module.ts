import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FantasyController } from "./fantasy.controller";
import { FantasyService } from "./fantasy.service";
import {
  FantasyLeague,
  FantasyLeagueSchema,
} from "./schemas/fantasy-league.schema";
import { FantasyTeam, FantasyTeamSchema } from "./schemas/fantasy-team.schema";
import {
  FantasyContest,
  FantasyContestSchema,
} from "./schemas/fantasy-contest.schema";
import {
  FantasyPlayer,
  FantasyPlayerSchema,
} from "./schemas/fantasy-player.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FantasyLeague.name, schema: FantasyLeagueSchema },
      { name: FantasyTeam.name, schema: FantasyTeamSchema },
      { name: FantasyContest.name, schema: FantasyContestSchema },
      { name: FantasyPlayer.name, schema: FantasyPlayerSchema },
    ]),
  ],
  controllers: [FantasyController],
  providers: [FantasyService],
  exports: [FantasyService],
})
export class FantasyModule {}
