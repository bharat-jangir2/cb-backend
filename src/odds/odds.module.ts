import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OddsService } from './odds.service';
import { OddsController } from './odds.controller';
import { Odds, OddsSchema } from './schemas/odds.schema';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Odds.name, schema: OddsSchema }]),
    MatchesModule,
  ],
  controllers: [OddsController],
  providers: [OddsService],
  exports: [OddsService],
})
export class OddsModule {} 