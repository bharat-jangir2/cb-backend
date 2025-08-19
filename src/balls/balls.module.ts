import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BallsService } from './balls.service';
import { BallsController } from './balls.controller';
import { Ball, BallSchema } from './schemas/ball.schema';
import { MatchesModule } from '../matches/matches.module';
import { MatchPlayersModule } from '../match-players/match-players.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ball.name, schema: BallSchema }]),
    MatchesModule,
    MatchPlayersModule,
  ],
  controllers: [BallsController],
  providers: [BallsService],
  exports: [BallsService],
})
export class BallsModule {} 