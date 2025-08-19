import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MatchesGateway } from "./websocket.gateway";
import { WsJwtGuard } from "./guards/ws-jwt.guard";
import { MatchesModule } from "../matches/matches.module";
import { BallsModule } from "../balls/balls.module";
import { OddsModule } from "../odds/odds.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "24h"),
        },
      }),
      inject: [ConfigService],
    }),
    MatchesModule,
    BallsModule,
    OddsModule,
  ],
  providers: [MatchesGateway, WsJwtGuard],
  exports: [MatchesGateway],
})
export class WebSocketModule {}
