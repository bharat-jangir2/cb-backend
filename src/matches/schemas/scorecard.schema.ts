import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ScorecardDocument = Scorecard & Document;

@Schema({ timestamps: true })
export class Scorecard {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match", unique: true })
  matchId: Types.ObjectId;

  // Innings data aggregated from Innings collection
  @Prop([
    {
      inningNumber: { type: Number, required: true },
      teamId: { type: Types.ObjectId, ref: "Team", required: true },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      overs: { type: Number, default: 0 },
      extras: { type: Number, default: 0 },
      boundaries: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      runRate: { type: Number, default: 0 },
      requiredRunRate: { type: Number, default: 0 },
      status: { type: String, default: "not_started" },
      startTime: { type: Date },
      endTime: { type: Date },
      duration: { type: Number, default: 0 },
      result: { type: String },
      resultDescription: { type: String },
      drsReviewsUsed: { type: Number, default: 0 },
      drsReviewsRemaining: { type: Number, default: 0 },

      // Batting stats aggregated from PlayerMatchStats
      batting: [
        {
          playerId: { type: Types.ObjectId, ref: "Player", required: true },
          runs: { type: Number, default: 0 },
          balls: { type: Number, default: 0 },
          fours: { type: Number, default: 0 },
          sixes: { type: Number, default: 0 },
          strikeRate: { type: Number, default: 0 },
          isOut: { type: Boolean, default: false },
          dismissal: {
            type: { type: String },
            bowler: { type: Types.ObjectId, ref: "Player" },
            caughtBy: { type: Types.ObjectId, ref: "Player" },
            runOutBy: { type: Types.ObjectId, ref: "Player" },
            stumpedBy: { type: Types.ObjectId, ref: "Player" },
            description: { type: String },
          },
          partnership: {
            partner: { type: Types.ObjectId, ref: "Player" },
            runs: { type: Number, default: 0 },
            balls: { type: Number, default: 0 },
          },
        },
      ],

      // Bowling stats aggregated from PlayerMatchStats
      bowling: [
        {
          playerId: { type: Types.ObjectId, ref: "Player", required: true },
          overs: { type: Number, default: 0 },
          balls: { type: Number, default: 0 },
          maidens: { type: Number, default: 0 },
          runsConceded: { type: Number, default: 0 },
          wickets: { type: Number, default: 0 },
          economy: { type: Number, default: 0 },
          average: { type: Number, default: 0 },
          strikeRate: { type: Number, default: 0 },
          extras: {
            wides: { type: Number, default: 0 },
            noBalls: { type: Number, default: 0 },
            byes: { type: Number, default: 0 },
            legByes: { type: Number, default: 0 },
          },
        },
      ],

      // Fall of wickets aggregated from Ball collection
      fallOfWickets: [
        {
          runs: { type: Number, required: true },
          wicket: { type: Number, required: true },
          playerId: { type: Types.ObjectId, ref: "Player", required: true },
          over: { type: Number, required: true },
          ball: { type: Number, required: true },
          dismissal: {
            type: { type: String },
            bowler: { type: Types.ObjectId, ref: "Player" },
            caughtBy: { type: Types.ObjectId, ref: "Player" },
            runOutBy: { type: Types.ObjectId, ref: "Player" },
            stumpedBy: { type: Types.ObjectId, ref: "Player" },
            description: { type: String },
          },
        },
      ],

      // Power plays from Innings collection
      powerPlays: [
        {
          type: { type: String, required: true },
          status: { type: String, default: "pending" },
          startOver: { type: Number, required: true },
          endOver: { type: Number, required: true },
          maxFieldersOutside: { type: Number, default: 2 },
          description: { type: String },
          isMandatory: { type: Boolean, default: false },
          isActive: { type: Boolean, default: false },
          currentOver: { type: Number, default: 0 },
          completedAt: { type: Date },
          notes: { type: String },
          stats: {
            runsScored: { type: Number, default: 0 },
            wicketsLost: { type: Number, default: 0 },
            oversCompleted: { type: Number, default: 0 },
            runRate: { type: Number, default: 0 },
            boundaries: { type: Number, default: 0 },
            sixes: { type: Number, default: 0 },
          },
        },
      ],
    },
  ])
  innings: Array<{
    inningNumber: number;
    teamId: Types.ObjectId;
    runs: number;
    wickets: number;
    overs: number;
    extras: number;
    boundaries: number;
    sixes: number;
    runRate: number;
    requiredRunRate: number;
    status: string;
    startTime?: Date;
    endTime?: Date;
    duration: number;
    result?: string;
    resultDescription?: string;
    drsReviewsUsed: number;
    drsReviewsRemaining: number;
    batting: Array<{
      playerId: Types.ObjectId;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      isOut: boolean;
      dismissal?: {
        type?: string;
        bowler?: Types.ObjectId;
        caughtBy?: Types.ObjectId;
        runOutBy?: Types.ObjectId;
        stumpedBy?: Types.ObjectId;
        description?: string;
      };
      partnership?: {
        partner: Types.ObjectId;
        runs: number;
        balls: number;
      };
    }>;
    bowling: Array<{
      playerId: Types.ObjectId;
      overs: number;
      balls: number;
      maidens: number;
      runsConceded: number;
      wickets: number;
      economy: number;
      average: number;
      strikeRate: number;
      extras: {
        wides: number;
        noBalls: number;
        byes: number;
        legByes: number;
      };
    }>;
    fallOfWickets: Array<{
      runs: number;
      wicket: number;
      playerId: Types.ObjectId;
      over: number;
      ball: number;
      dismissal?: {
        type?: string;
        bowler?: Types.ObjectId;
        caughtBy?: Types.ObjectId;
        runOutBy?: Types.ObjectId;
        stumpedBy?: Types.ObjectId;
        description?: string;
      };
    }>;
    powerPlays: Array<{
      type: string;
      status: string;
      startOver: number;
      endOver: number;
      maxFieldersOutside: number;
      description?: string;
      isMandatory: boolean;
      isActive: boolean;
      currentOver: number;
      completedAt?: Date;
      notes?: string;
      stats: {
        runsScored: number;
        wicketsLost: number;
        oversCompleted: number;
        runRate: number;
        boundaries: number;
        sixes: number;
      };
    }>;
  }>;

  // Ball-by-ball commentary aggregated from Ball collection
  @Prop([
    {
      ball: { type: String, required: true }, // "18.3"
      innings: { type: Number, required: true },
      over: { type: Number, required: true },
      ballNumber: { type: Number, required: true },
      batsmanId: { type: Types.ObjectId, ref: "Player" },
      bowlerId: { type: Types.ObjectId, ref: "Player" },
      runs: { type: Number, default: 0 },
      event: { type: String, required: true }, // "SIX", "WICKET", "FOUR", etc.
      comment: { type: String },
      extras: {
        type: { type: String },
        runs: { type: Number, default: 0 },
        description: { type: String },
      },
      wicket: {
        type: { type: String },
        batsman: { type: Types.ObjectId, ref: "Player" },
        bowler: { type: Types.ObjectId, ref: "Player" },
        caughtBy: { type: Types.ObjectId, ref: "Player" },
        runOutBy: { type: Types.ObjectId, ref: "Player" },
        stumpedBy: { type: Types.ObjectId, ref: "Player" },
        description: { type: String },
      },
      reviewed: { type: Boolean, default: false },
      reviewResult: { type: String },
      scoreState: {
        teamARuns: { type: Number, default: 0 },
        teamAWickets: { type: Number, default: 0 },
        teamAOvers: { type: Number, default: 0 },
        teamBRuns: { type: Number, default: 0 },
        teamBWickets: { type: Number, default: 0 },
        teamBOvers: { type: Number, default: 0 },
        currentInnings: { type: Number, default: 1 },
        currentOver: { type: Number, default: 0 },
        currentBall: { type: Number, default: 0 },
      },
    },
  ])
  commentary: Array<{
    ball: string;
    innings: number;
    over: number;
    ballNumber: number;
    batsmanId?: Types.ObjectId;
    bowlerId?: Types.ObjectId;
    runs: number;
    event: string;
    comment?: string;
    extras?: {
      type?: string;
      runs: number;
      description?: string;
    };
    wicket?: {
      type?: string;
      batsman?: Types.ObjectId;
      bowler?: Types.ObjectId;
      caughtBy?: Types.ObjectId;
      runOutBy?: Types.ObjectId;
      stumpedBy?: Types.ObjectId;
      description?: string;
    };
    reviewed: boolean;
    reviewResult?: string;
    scoreState: {
      teamARuns: number;
      teamAWickets: number;
      teamAOvers: number;
      teamBRuns: number;
      teamBWickets: number;
      teamBOvers: number;
      currentInnings: number;
      currentOver: number;
      currentBall: number;
    };
  }>;

  // Match summary
  @Prop({
    type: {
      totalOvers: { type: Number, default: 20 },
      matchType: { type: String, default: "T20" },
      venue: { type: String },
      tossWinner: { type: Types.ObjectId, ref: "Team" },
      tossDecision: { type: String },
      result: { type: String },
      manOfTheMatch: { type: Types.ObjectId, ref: "Player" },
      umpires: [{ type: String }],
      thirdUmpire: { type: String },
      matchReferee: { type: String },
      weather: { type: String },
      pitchCondition: { type: String },
    },
  })
  matchSummary: {
    totalOvers: number;
    matchType: string;
    venue?: string;
    tossWinner?: Types.ObjectId;
    tossDecision?: string;
    result?: string;
    manOfTheMatch?: Types.ObjectId;
    umpires: string[];
    thirdUmpire?: string;
    matchReferee?: string;
    weather?: string;
    pitchCondition?: string;
  };

  // Last update timestamp for real-time sync
  @Prop({ default: Date.now })
  lastUpdateTime: Date;

  // Version for optimistic locking
  @Prop({ default: 1 })
  version: number;
}

export const ScorecardSchema = SchemaFactory.createForClass(Scorecard);

// Indexes for better performance
ScorecardSchema.index({ matchId: 1 }, { unique: true });
ScorecardSchema.index({ "innings.inningNumber": 1 });
ScorecardSchema.index({ "commentary.ball": 1 });
ScorecardSchema.index({ lastUpdateTime: 1 });
ScorecardSchema.index({ "matchSummary.matchType": 1 });
ScorecardSchema.index({ "matchSummary.result": 1 });
