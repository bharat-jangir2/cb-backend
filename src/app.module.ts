import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TeamsModule } from "./teams/teams.module";
import { PlayersModule } from "./players/players.module";
import { MatchesModule } from "./matches/matches.module";
import { MatchPlayersModule } from "./match-players/match-players.module";
import { BallsModule } from "./balls/balls.module";
import { OddsModule } from "./odds/odds.module";
import { AgentsModule } from "./agents/agents.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { NewsModule } from "./news/news.module";
import { TournamentsModule } from "./tournaments/tournaments.module";
import { FantasyModule } from "./fantasy/fantasy.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { CommunityModule } from "./community/community.module";
import { PremiumModule } from "./premium/premium.module";
import { ScrapersModule } from "./scrapers/scrapers.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/cricket_live_score",
      {
        dbName: process.env.MONGODB_DB_NAME || "cricket_live_score",
      }
    ),
    AuthModule,
    UsersModule,
    TeamsModule,
    PlayersModule,
    MatchesModule,
    MatchPlayersModule,
    BallsModule,
    OddsModule,
    AgentsModule,
    WebSocketModule,
    NewsModule,
    TournamentsModule,
    FantasyModule,
    AnalyticsModule,
    CommunityModule,
    PremiumModule,
    ScrapersModule,
  ],
})
export class AppModule {}
