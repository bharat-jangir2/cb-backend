import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PlayerStatsDocument = PlayerStats & Document;

@Schema({ timestamps: true })
export class PlayerStats {
  @Prop({ type: Types.ObjectId, ref: "Player", required: true })
  playerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Tournament" })
  tournamentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Series" })
  seriesId: Types.ObjectId;

  @Prop({ required: true })
  format: string; // 'T20', 'ODI', 'TEST', 'ALL'

  @Prop({ required: true })
  period: string; // 'MATCH', 'SERIES', 'TOURNAMENT', 'CAREER', 'YEAR', 'MONTH'

  // Batting Statistics
  @Prop({
    type: {
      matches: { type: Number, default: 0 },
      innings: { type: Number, default: 0 },
      notOuts: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      ballsFaced: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      fifties: { type: Number, default: 0 },
      hundreds: { type: Number, default: 0 },
      ducks: { type: Number, default: 0 },
      runOuts: { type: Number, default: 0 },
      stumpings: { type: Number, default: 0 },
      catches: { type: Number, default: 0 },
      directRunOuts: { type: Number, default: 0 },
    },
  })
  batting: {
    matches: number;
    innings: number;
    notOuts: number;
    runs: number;
    highestScore: number;
    average: number;
    strikeRate: number;
    ballsFaced: number;
    fours: number;
    sixes: number;
    fifties: number;
    hundreds: number;
    ducks: number;
    runOuts: number;
    stumpings: number;
    catches: number;
    directRunOuts: number;
  };

  // Bowling Statistics
  @Prop({
    type: {
      matches: { type: Number, default: 0 },
      innings: { type: Number, default: 0 },
      overs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      bestBowling: { type: String, default: "0/0" },
      fourWickets: { type: Number, default: 0 },
      fiveWickets: { type: Number, default: 0 },
      tenWickets: { type: Number, default: 0 },
      maidenOvers: { type: Number, default: 0 },
      extras: { type: Number, default: 0 },
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 },
    },
  })
  bowling: {
    matches: number;
    innings: number;
    overs: number;
    balls: number;
    wickets: number;
    runs: number;
    average: number;
    economy: number;
    strikeRate: number;
    bestBowling: string;
    fourWickets: number;
    fiveWickets: number;
    tenWickets: number;
    maidenOvers: number;
    extras: number;
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };

  // Fielding Statistics
  @Prop({
    type: {
      matches: { type: Number, default: 0 },
      catches: { type: Number, default: 0 },
      stumpings: { type: Number, default: 0 },
      runOuts: { type: Number, default: 0 },
      directRunOuts: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
    },
  })
  fielding: {
    matches: number;
    catches: number;
    stumpings: number;
    runOuts: number;
    directRunOuts: number;
    assists: number;
  };

  // Performance Metrics
  @Prop({
    type: {
      manOfTheMatch: { type: Number, default: 0 },
      manOfTheSeries: { type: Number, default: 0 },
      playerOfTheTournament: { type: Number, default: 0 },
      bestBatsman: { type: Number, default: 0 },
      bestBowler: { type: Number, default: 0 },
      bestFielder: { type: Number, default: 0 },
      emergingPlayer: { type: Number, default: 0 },
    },
  })
  awards: {
    manOfTheMatch: number;
    manOfTheSeries: number;
    playerOfTheTournament: number;
    bestBatsman: number;
    bestBowler: number;
    bestFielder: number;
    emergingPlayer: number;
  };

  // Advanced Analytics
  @Prop({
    type: {
      consistency: { type: Number, default: 0 }, // 0-100
      pressureHandling: { type: Number, default: 0 }, // 0-100
      clutchPerformance: { type: Number, default: 0 }, // 0-100
      formRating: { type: Number, default: 0 }, // 0-100
      fitnessScore: { type: Number, default: 0 }, // 0-100
      experienceLevel: { type: String, default: "ROOKIE" }, // ROOKIE, EXPERIENCED, VETERAN
    },
  })
  analytics: {
    consistency: number;
    pressureHandling: number;
    clutchPerformance: number;
    formRating: number;
    fitnessScore: number;
    experienceLevel: string;
  };

  // Recent Form (Last 10 matches)
  @Prop({
    type: [
      {
        matchId: { type: Types.ObjectId, ref: "Match" },
        date: { type: Date },
        runs: { type: Number },
        wickets: { type: Number },
        catches: { type: Number },
        stumpings: { type: Number },
        runOuts: { type: Number },
        performance: { type: String }, // 'EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'
      },
    ],
  })
  recentForm: Array<{
    matchId: Types.ObjectId;
    date: Date;
    runs: number;
    wickets: number;
    catches: number;
    stumpings: number;
    runOuts: number;
    performance: string;
  }>;

  // Head-to-Head Statistics
  @Prop({
    type: [
      {
        opponent: { type: Types.ObjectId, ref: "Team" },
        matches: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        economy: { type: Number, default: 0 },
      },
    ],
  })
  headToHead: Array<{
    opponent: Types.ObjectId;
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
    economy: number;
  }>;

  // Venue Performance
  @Prop({
    type: [
      {
        venue: { type: String },
        matches: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        economy: { type: Number, default: 0 },
      },
    ],
  })
  venuePerformance: Array<{
    venue: string;
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
    economy: number;
  }>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const PlayerStatsSchema = SchemaFactory.createForClass(PlayerStats);

// Indexes
PlayerStatsSchema.index({ playerId: 1, format: 1, period: 1 });
PlayerStatsSchema.index({ matchId: 1 });
PlayerStatsSchema.index({ tournamentId: 1 });
PlayerStatsSchema.index({ seriesId: 1 });
PlayerStatsSchema.index({ "batting.runs": -1 });
PlayerStatsSchema.index({ "bowling.wickets": -1 });
PlayerStatsSchema.index({ "analytics.formRating": -1 });
PlayerStatsSchema.index({ lastUpdated: -1 });
