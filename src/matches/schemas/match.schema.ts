import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true })
  name: string;

  @Prop()
  venue: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ default: "SCHEDULED" })
  status: string;

  @Prop({ type: Types.ObjectId, ref: "Team", required: true })
  teamAId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Team", required: true })
  teamBId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Team" })
  tossWinner: Types.ObjectId;

  @Prop()
  tossDecision: string; // 'bat' or 'bowl'

  @Prop({ default: "T20" })
  matchType: string; // 'T20', 'ODI', 'TEST'

  @Prop({ default: 20 })
  overs: number;

  @Prop({ default: 1 })
  currentInnings: number;

  @Prop({ default: 0 })
  currentOver: number;

  @Prop({ default: 0 })
  currentBall: number;

  @Prop()
  result: string;

  @Prop({ type: Types.ObjectId, ref: "Player" })
  manOfTheMatch: Types.ObjectId;

  @Prop([String])
  umpires: string[];

  @Prop()
  thirdUmpire: string;

  @Prop()
  matchReferee: string;

  @Prop()
  weather: string;

  @Prop()
  pitchCondition: string;

  @Prop({ default: true })
  isActive: boolean;

  // Squad management
  @Prop({
    type: {
      teamA: [{ type: Types.ObjectId, ref: "Player" }],
      teamB: [{ type: Types.ObjectId, ref: "Player" }],
    },
  })
  squads: {
    teamA: Types.ObjectId[];
    teamB: Types.ObjectId[];
  };

  // Playing XI with captain, vice-captain, and batting order
  @Prop({
    type: {
      teamA: {
        players: [{ type: Types.ObjectId, ref: "Player" }],
        captain: { type: Types.ObjectId, ref: "Player" },
        viceCaptain: { type: Types.ObjectId, ref: "Player" },
        battingOrder: [{ type: Types.ObjectId, ref: "Player" }],
        wicketKeeper: { type: Types.ObjectId, ref: "Player" },
      },
      teamB: {
        players: [{ type: Types.ObjectId, ref: "Player" }],
        captain: { type: Types.ObjectId, ref: "Player" },
        viceCaptain: { type: Types.ObjectId, ref: "Player" },
        battingOrder: [{ type: Types.ObjectId, ref: "Player" }],
        wicketKeeper: { type: Types.ObjectId, ref: "Player" },
      },
    },
  })
  playingXI: {
    teamA: {
      players: Types.ObjectId[];
      captain: Types.ObjectId;
      viceCaptain: Types.ObjectId;
      battingOrder: Types.ObjectId[];
      wicketKeeper: Types.ObjectId;
    };
    teamB: {
      players: Types.ObjectId[];
      captain: Types.ObjectId;
      viceCaptain: Types.ObjectId;
      battingOrder: Types.ObjectId[];
      wicketKeeper: Types.ObjectId;
    };
  };

  // Current players on field
  @Prop({
    type: {
      striker: { type: Types.ObjectId, ref: "Player" },
      nonStriker: { type: Types.ObjectId, ref: "Player" },
      bowler: { type: Types.ObjectId, ref: "Player" },
      lastUpdated: { type: Date, default: Date.now },
    },
  })
  currentPlayers: {
    striker: Types.ObjectId;
    nonStriker: Types.ObjectId;
    bowler: Types.ObjectId;
    lastUpdated: Date;
  };

  // Match Settings
  @Prop({
    type: {
      drsAvailable: { type: Boolean, default: true },
      maxDRSReviews: { type: Number, default: 2 },
      drsReviewsPerInnings: { type: Number, default: 1 },
      superOver: { type: Boolean, default: false },
      reserveDay: { type: Boolean, default: false },
      rainRule: { type: String, default: "DLS" }, // 'DLS', 'VJD', 'none'
      minimumOvers: { type: Number, default: 5 },
      powerPlayOvers: { type: Number, default: 6 },
      fieldingRestrictions: { type: Boolean, default: true },
    },
  })
  settings: {
    drsAvailable: boolean;
    maxDRSReviews: number;
    drsReviewsPerInnings: number;
    superOver: boolean;
    reserveDay: boolean;
    rainRule: string;
    minimumOvers: number;
    powerPlayOvers: number;
    fieldingRestrictions: boolean;
  };

  // Live Match State
  @Prop({
    type: {
      lastBallTime: { type: Date },
      lastUpdateTime: { type: Date },
      isLive: { type: Boolean, default: false },
      streamUrl: { type: String },
      chatEnabled: { type: Boolean, default: true },
      predictionsEnabled: { type: Boolean, default: true },
      fantasyEnabled: { type: Boolean, default: true },
    },
  })
  liveState: {
    lastBallTime?: Date;
    lastUpdateTime?: Date;
    isLive: boolean;
    streamUrl?: string;
    chatEnabled: boolean;
    predictionsEnabled: boolean;
    fantasyEnabled: boolean;
  };

  // WebSocket connections tracking
  @Prop({
    type: {
      totalConnections: { type: Number, default: 0 },
      activeConnections: { type: Number, default: 0 },
      lastConnectionUpdate: { type: Date, default: Date.now },
    },
  })
  websocketStats: {
    totalConnections: number;
    activeConnections: number;
    lastConnectionUpdate: Date;
  };
}

export const MatchSchema = SchemaFactory.createForClass(Match);

// Indexes for better performance
MatchSchema.index({ teamAId: 1, teamBId: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ startTime: 1 });
MatchSchema.index({ isActive: 1 });
MatchSchema.index({ "currentPlayers.striker": 1 });
MatchSchema.index({ "currentPlayers.bowler": 1 });
MatchSchema.index({ "liveState.isLive": 1 });
