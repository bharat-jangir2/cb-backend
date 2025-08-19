import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MatchStatsDocument = MatchStats & Document;

@Schema({ timestamps: true })
export class MatchStats {
  @Prop({ type: Types.ObjectId, ref: "Match", required: true })
  matchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Tournament" })
  tournamentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Series" })
  seriesId: Types.ObjectId;

  @Prop({ required: true })
  format: string; // 'T20', 'ODI', 'TEST'

  // Match Overview
  @Prop({
    type: {
      totalRuns: { type: Number, default: 0 },
      totalWickets: { type: Number, default: 0 },
      totalOvers: { type: Number, default: 0 },
      totalBalls: { type: Number, default: 0 },
      runRate: { type: Number, default: 0 },
      boundaries: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      extras: { type: Number, default: 0 },
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 },
    },
  })
  overview: {
    totalRuns: number;
    totalWickets: number;
    totalOvers: number;
    totalBalls: number;
    runRate: number;
    boundaries: number;
    sixes: number;
    extras: number;
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };

  // Team Performance
  @Prop({
    type: {
      teamA: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
        runRate: { type: Number, default: 0 },
        boundaries: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        extras: { type: Number, default: 0 },
      },
      teamB: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
        runRate: { type: Number, default: 0 },
        boundaries: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        extras: { type: Number, default: 0 },
      },
    },
  })
  teamPerformance: {
    teamA: {
      runs: number;
      wickets: number;
      overs: number;
      runRate: number;
      boundaries: number;
      sixes: number;
      extras: number;
    };
    teamB: {
      runs: number;
      wickets: number;
      overs: number;
      runRate: number;
      boundaries: number;
      sixes: number;
      extras: number;
    };
  };

  // Innings Analysis
  @Prop({
    type: [
      {
        innings: { type: Number, required: true },
        team: { type: Types.ObjectId, ref: "Team" },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
        runRate: { type: Number, default: 0 },
        boundaries: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        extras: { type: Number, default: 0 },
        powerPlayRuns: { type: Number, default: 0 },
        powerPlayWickets: { type: Number, default: 0 },
        middleOversRuns: { type: Number, default: 0 },
        middleOversWickets: { type: Number, default: 0 },
        deathOversRuns: { type: Number, default: 0 },
        deathOversWickets: { type: Number, default: 0 },
      },
    ],
  })
  innings: Array<{
    innings: number;
    team: Types.ObjectId;
    runs: number;
    wickets: number;
    overs: number;
    runRate: number;
    boundaries: number;
    sixes: number;
    extras: number;
    powerPlayRuns: number;
    powerPlayWickets: number;
    middleOversRuns: number;
    middleOversWickets: number;
    deathOversRuns: number;
    deathOversWickets: number;
  }>;

  // Key Moments
  @Prop({
    type: [
      {
        over: { type: Number, required: true },
        ball: { type: Number, required: true },
        event: { type: String, required: true }, // 'WICKET', 'BOUNDARY', 'SIX', 'MILESTONE'
        description: { type: String },
        player: { type: Types.ObjectId, ref: "Player" },
        team: { type: Types.ObjectId, ref: "Team" },
        impact: { type: String }, // 'HIGH', 'MEDIUM', 'LOW'
      },
    ],
  })
  keyMoments: Array<{
    over: number;
    ball: number;
    event: string;
    description: string;
    player: Types.ObjectId;
    team: Types.ObjectId;
    impact: string;
  }>;

  // Partnership Analysis
  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: "Team" },
        innings: { type: Number, required: true },
        wicket: { type: Number, required: true },
        player1: { type: Types.ObjectId, ref: "Player" },
        player2: { type: Types.ObjectId, ref: "Player" },
        runs: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        runRate: { type: Number, default: 0 },
        boundaries: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
      },
    ],
  })
  partnerships: Array<{
    team: Types.ObjectId;
    innings: number;
    wicket: number;
    player1: Types.ObjectId;
    player2: Types.ObjectId;
    runs: number;
    balls: number;
    runRate: number;
    boundaries: number;
    sixes: number;
  }>;

  // Bowling Analysis
  @Prop({
    type: [
      {
        bowler: { type: Types.ObjectId, ref: "Player" },
        team: { type: Types.ObjectId, ref: "Team" },
        overs: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        economy: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
        maidens: { type: Number, default: 0 },
        extras: { type: Number, default: 0 },
        wides: { type: Number, default: 0 },
        noBalls: { type: Number, default: 0 },
        boundaries: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
      },
    ],
  })
  bowlingAnalysis: Array<{
    bowler: Types.ObjectId;
    team: Types.ObjectId;
    overs: number;
    balls: number;
    runs: number;
    wickets: number;
    economy: number;
    strikeRate: number;
    average: number;
    maidens: number;
    extras: number;
    wides: number;
    noBalls: number;
    boundaries: number;
    sixes: number;
  }>;

  // Batting Analysis
  @Prop({
    type: [
      {
        batsman: { type: Types.ObjectId, ref: "Player" },
        team: { type: Types.ObjectId, ref: "Team" },
        innings: { type: Number, required: true },
        runs: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        boundaries: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        dots: { type: Number, default: 0 },
        ones: { type: Number, default: 0 },
        twos: { type: Number, default: 0 },
        threes: { type: Number, default: 0 },
        dismissal: { type: String }, // 'BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT', etc.
        bowler: { type: Types.ObjectId, ref: "Player" },
        fielder: { type: Types.ObjectId, ref: "Player" },
      },
    ],
  })
  battingAnalysis: Array<{
    batsman: Types.ObjectId;
    team: Types.ObjectId;
    innings: number;
    runs: number;
    balls: number;
    strikeRate: number;
    boundaries: number;
    sixes: number;
    fours: number;
    dots: number;
    ones: number;
    twos: number;
    threes: number;
    dismissal: string;
    bowler: Types.ObjectId;
    fielder: Types.ObjectId;
  }>;

  // Match Insights
  @Prop({
    type: {
      matchType: { type: String }, // 'HIGH_SCORING', 'LOW_SCORING', 'BALANCED', 'BOWLER_FRIENDLY'
      keyFactors: [{ type: String }], // ['PITCH_CONDITION', 'WEATHER', 'TOSS_IMPACT', etc.]
      turningPoint: { type: String },
      playerOfTheMatch: { type: Types.ObjectId, ref: "Player" },
      bestBatsman: { type: Types.ObjectId, ref: "Player" },
      bestBowler: { type: Types.ObjectId, ref: "Player" },
      bestFielder: { type: Types.ObjectId, ref: "Player" },
      matchRating: { type: Number, default: 0 }, // 0-10
      excitementLevel: { type: String }, // 'HIGH', 'MEDIUM', 'LOW'
    },
  })
  insights: {
    matchType: string;
    keyFactors: string[];
    turningPoint: string;
    playerOfTheMatch: Types.ObjectId;
    bestBatsman: Types.ObjectId;
    bestBowler: Types.ObjectId;
    bestFielder: Types.ObjectId;
    matchRating: number;
    excitementLevel: string;
  };

  // Performance Trends
  @Prop({
    type: {
      runRateTrend: [{ type: Number }], // Run rate by over
      wicketTrend: [{ type: Number }], // Wickets by over
      boundaryTrend: [{ type: Number }], // Boundaries by over
      pressureIndex: [{ type: Number }], // Pressure index by over
      momentumShift: [{ type: String }], // Momentum shifts in the match
    },
  })
  trends: {
    runRateTrend: number[];
    wicketTrend: number[];
    boundaryTrend: number[];
    pressureIndex: number[];
    momentumShift: string[];
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const MatchStatsSchema = SchemaFactory.createForClass(MatchStats);

// Indexes
MatchStatsSchema.index({ matchId: 1 });
MatchStatsSchema.index({ tournamentId: 1 });
MatchStatsSchema.index({ seriesId: 1 });
MatchStatsSchema.index({ format: 1 });
MatchStatsSchema.index({ "insights.matchRating": -1 });
MatchStatsSchema.index({ lastUpdated: -1 });
