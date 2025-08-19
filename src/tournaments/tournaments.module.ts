import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  TournamentsController,
  SeriesController,
} from "./tournaments.controller";
import { TournamentsService } from "./tournaments.service";
import { Tournament, TournamentSchema } from "./schemas/tournament.schema";
import { Series, SeriesSchema } from "./schemas/series.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tournament.name, schema: TournamentSchema },
      { name: Series.name, schema: SeriesSchema },
    ]),
  ],
  controllers: [TournamentsController, SeriesController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
