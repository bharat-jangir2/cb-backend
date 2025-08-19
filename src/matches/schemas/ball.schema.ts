import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BallDocument = Ball & Document;

@Schema({ timestamps: true })
export class Ball {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  innings: number;

  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ required: true })
  eventType: string; // 'runs', 'wicket', 'extra', 'over_change', 'innings_change'

  @Prop({ default: 0 })
  runs: number;

  // Extra details
  @Prop({
    type: {
      type: { type: String }, // 'wide', 'no_ball', 'bye', 'leg_bye'
      runs: { type: Number, default: 0 },
      description: { type: String },
    },
  })
  extras?: {
    type: string;
    runs: number;
    description?: string;
  };

  // Wicket details
  @Prop({
    type: {
      type: { type: String }, // 'bowled', 'caught', 'lbw', 'run_out', 'stumped', 'hit_wicket', 'obstructing', 'handled_ball', 'timed_out', 'retired_out'
      batsman: { type: Types.ObjectId, ref: "Player" },
      bowler: { type: Types.ObjectId, ref: "Player" },
      caughtBy: { type: Types.ObjectId, ref: "Player" },
      runOutBy: { type: Types.ObjectId, ref: "Player" },
      stumpedBy: { type: Types.ObjectId, ref: "Player" },
      description: { type: String },
    },
  })
  wicket?: {
    type: string;
    batsman: Types.ObjectId;
    bowler?: Types.ObjectId;
    caughtBy?: Types.ObjectId;
    runOutBy?: Types.ObjectId;
    stumpedBy?: Types.ObjectId;
    description?: string;
  };

  // Players involved
  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  striker: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  nonStriker: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  bowler: Types.ObjectId;

  // Commentary
  @Prop()
  commentary: string;

  // DRS Review
  @Prop({ default: false })
  reviewed: boolean;

  @Prop()
  reviewResult: string; // 'upheld', 'struck_down', 'umpires_call'

  // Fielding positions for this ball
  @Prop([
    {
      player: { type: Types.ObjectId, ref: "Player" },
      position: { type: String, required: true },
      coordinates: {
        x: { type: Number },
        y: { type: Number },
      },
    },
  ])
  fieldingPositions: Array<{
    player: Types.ObjectId;
    position: string;
    coordinates?: {
      x: number;
      y: number;
    };
  }>;

  // Score state after this ball
  @Prop({
    type: {
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
  })
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

  // Power play status
  @Prop({
    type: {
      isActive: { type: Boolean, default: false },
      type: { type: String },
      startOver: { type: Number },
      endOver: { type: Number },
      maxFieldersOutside: { type: Number, default: 2 },
    },
  })
  powerPlayStatus: {
    isActive: boolean;
    type?: string;
    startOver?: number;
    endOver?: number;
    maxFieldersOutside: number;
  };

  // Additional metadata
  @Prop({ type: Object })
  metadata: any; // For any additional data specific to this ball
}

export const BallSchema = SchemaFactory.createForClass(Ball);

// Indexes for better performance
BallSchema.index(
  { matchId: 1, innings: 1, over: 1, ball: 1 },
  { unique: true }
);
BallSchema.index({ matchId: 1, innings: 1 });
BallSchema.index({ matchId: 1, eventType: 1 });
BallSchema.index({ striker: 1 });
BallSchema.index({ bowler: 1 });
BallSchema.index({ timestamp: 1 });
BallSchema.index({ reviewed: 1 });
