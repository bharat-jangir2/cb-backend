import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchPlayersService } from './match-players.service';
import { MatchPlayersController } from './match-players.controller';
import { MatchPlayer, MatchPlayerSchema } from './schemas/match-player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MatchPlayer.name, schema: MatchPlayerSchema }]),
  ],
  controllers: [MatchPlayersController],
  providers: [MatchPlayersService],
  exports: [MatchPlayersService],
})
export class MatchPlayersModule {} 