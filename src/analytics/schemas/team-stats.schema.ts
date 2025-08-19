import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TeamStatsDocument = TeamStats & Document;

@Schema({ timestamps: true })
export class TeamStats {
  @Prop({ type: Types.ObjectId, ref: "Team", required: true })
  teamId: Types.ObjectId;

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

  // Team Performance Statistics
  @Prop({
    type: {
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      ties: { type: Number, default: 0 },
      noResults: { type: Number, default: 0 },
      winPercentage: { type: Number, default: 0 },
      totalRuns: { type: Number, default: 0 },
      totalWickets: { type: Number, default: 0 },
      averageRuns: { type: Number, default: 0 },
      averageWickets: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      lowestScore: { type: Number, default: 0 },
      bestBowling: { type: String, default: "0/0" },
    },
  })
  performance: {
    matches: number;
    wins: number;
    losses: number;
    ties: number;
    noResults: number;
    winPercentage: number;
    totalRuns: number;
    totalWickets: number;
    averageRuns: number;
    averageWickets: number;
    highestScore: number;
    lowestScore: number;
    bestBowling: string;
  };

  // Batting Statistics
  @Prop({
    type: {
      totalRuns: { type: Number, default: 0 },
      totalOvers: { type: Number, default: 0 },
      totalBalls: { type: Number, default: 0 },
      averageRuns: { type: Number, default: 0 },
      runRate: { type: Number, default: 0 },
      boundaries: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      fifties: { type: Number, default: 0 },
      hundreds: { type: Number, default: 0 },
      ducks: { type: Number, default: 0 },
      extras: { type: Number, default: 0 },
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
    },
  })
  batting: {
    totalRuns: number;
    totalOvers: number;
    totalBalls: number;
    averageRuns: number;
    runRate: number;
    boundaries: number;
    sixes: number;
    fifties: number;
    hundreds: number;
    ducks: number;
    extras: number;
    wides: number;
    noBalls: number;
  };

  // Bowling Statistics
  @Prop({
    type: {
      totalWickets: { type: Number, default: 0 },
      totalOvers: { type: Number, default: 0 },
      totalBalls: { type: Number, default: 0 },
      totalRuns: { type: Number, default: 0 },
      averageWickets: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      fourWickets: { type: Number, default: 0 },
      fiveWickets: { type: Number, default: 0 },
      tenWickets: { type: Number, default: 0 },
      maidenOvers: { type: Number, default: 0 },
      extras: { type: Number, default: 0 },
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
    },
  })
  bowling: {
    totalWickets: number;
    totalOvers: number;
    totalBalls: number;
    totalRuns: number;
    averageWickets: number;
    economy: number;
    strikeRate: number;
    fourWickets: number;
    fiveWickets: number;
    tenWickets: number;
    maidenOvers: number;
    extras: number;
    wides: number;
    noBalls: number;
  };

  // Fielding Statistics
  @Prop({
    type: {
      catches: { type: Number, default: 0 },
      stumpings: { type: Number, default: 0 },
      runOuts: { type: Number, default: 0 },
      directRunOuts: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
    },
  })
  fielding: {
    catches: number;
    stumpings: number;
    runOuts: number;
    directRunOuts: number;
    assists: number;
  };

  // Team Analytics
  @Prop({
    type: {
      consistency: { type: Number, default: 0 }, // 0-100
      pressureHandling: { type: Number, default: 0 }, // 0-100
      clutchPerformance: { type: Number, default: 0 }, // 0-100
      formRating: { type: Number, default: 0 }, // 0-100
      teamStrength: { type: Number, default: 0 }, // 0-100
      experienceLevel: { type: String, default: "ROOKIE" }, // ROOKIE, EXPERIENCED, VETERAN
    },
  })
  analytics: {
    consistency: number;
    pressureHandling: number;
    clutchPerformance: number;
    formRating: number;
    teamStrength: number;
    experienceLevel: string;
  };

  // Recent Performance (Last 10 matches)
  @Prop({
    type: [
      {
        matchId: { type: Types.ObjectId, ref: "Match" },
        date: { type: Date },
        result: { type: String }, // 'WIN', 'LOSS', 'TIE', 'NO_RESULT'
        runs: { type: Number },
        wickets: { type: Number },
        opponent: { type: Types.ObjectId, ref: "Team" },
        performance: { type: String }, // 'EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'
      },
    ],
  })
  recentPerformance: Array<{
    matchId: Types.ObjectId;
    date: Date;
    result: string;
    runs: number;
    wickets: number;
    opponent: Types.ObjectId;
    performance: string;
  }>;

  // Head-to-Head Statistics
  @Prop({
    type: [
      {
        opponent: { type: Types.ObjectId, ref: "Team" },
        matches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        ties: { type: Number, default: 0 },
        winPercentage: { type: Number, default: 0 },
        averageRuns: { type: Number, default: 0 },
        averageWickets: { type: Number, default: 0 },
      },
    ],
  })
  headToHead: Array<{
    opponent: Types.ObjectId;
    matches: number;
    wins: number;
    losses: number;
    ties: number;
    winPercentage: number;
    averageRuns: number;
    averageWickets: number;
  }>;

  // Venue Performance
  @Prop({
    type: [
      {
        venue: { type: String },
        matches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        winPercentage: { type: Number, default: 0 },
        averageRuns: { type: Number, default: 0 },
        averageWickets: { type: Number, default: 0 },
      },
    ],
  })
  venuePerformance: Array<{
    venue: string;
    matches: number;
    wins: number;
    losses: number;
    winPercentage: number;
    averageRuns: number;
    averageWickets: number;
  }>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const TeamStatsSchema = SchemaFactory.createForClass(TeamStats);

// Indexes
TeamStatsSchema.index({ teamId: 1, format: 1, period: 1 });
TeamStatsSchema.index({ matchId: 1 });
TeamStatsSchema.index({ tournamentId: 1 });
TeamStatsSchema.index({ seriesId: 1 });
TeamStatsSchema.index({ "performance.wins": -1 });
TeamStatsSchema.index({ "analytics.formRating": -1 });
TeamStatsSchema.index({ lastUpdated: -1 });
