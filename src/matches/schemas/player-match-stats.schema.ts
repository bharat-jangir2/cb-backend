import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PlayerMatchStatsDocument = PlayerMatchStats & Document;

@Schema({ timestamps: true })
export class PlayerMatchStats {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  player: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Team" })
  team: Types.ObjectId;

  @Prop({ required: true })
  innings: number;

  // Batting statistics
  @Prop({ default: 0 })
  battingRuns: number;

  @Prop({ default: 0 })
  battingBalls: number;

  @Prop({ default: 0 })
  battingFours: number;

  @Prop({ default: 0 })
  battingSixes: number;

  @Prop({ default: 0 })
  battingStrikeRate: number;

  @Prop({
    type: {
      type: { type: String }, // 'bowled', 'caught', 'lbw', 'run_out', 'stumped', 'hit_wicket', 'obstructing', 'handled_ball', 'timed_out', 'retired_out', 'not_out'
      bowler: { type: Types.ObjectId, ref: "Player" },
      caughtBy: { type: Types.ObjectId, ref: "Player" },
      runOutBy: { type: Types.ObjectId, ref: "Player" },
      stumpedBy: { type: Types.ObjectId, ref: "Player" },
      description: { type: String },
    },
  })
  battingDismissal?: {
    type: string;
    bowler?: Types.ObjectId;
    caughtBy?: Types.ObjectId;
    runOutBy?: Types.ObjectId;
    stumpedBy?: Types.ObjectId;
    description?: string;
  };

  // Bowling statistics
  @Prop({ default: 0 })
  bowlingOvers: number;

  @Prop({ default: 0 })
  bowlingBalls: number;

  @Prop({ default: 0 })
  bowlingRuns: number;

  @Prop({ default: 0 })
  bowlingWickets: number;

  @Prop({ default: 0 })
  bowlingMaidens: number;

  @Prop({
    type: {
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 },
    },
  })
  bowlingExtras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };

  @Prop({ default: 0 })
  bowlingEconomy: number;

  @Prop({ default: 0 })
  bowlingAverage: number;

  @Prop({ default: 0 })
  bowlingStrikeRate: number;

  // Fielding statistics
  @Prop({ default: 0 })
  fieldingCatches: number;

  @Prop({ default: 0 })
  fieldingStumpings: number;

  @Prop({ default: 0 })
  fieldingRunOuts: number;

  @Prop({ default: 0 })
  fieldingDirectHits: number;

  // Partnership information
  @Prop({
    type: {
      partner: { type: Types.ObjectId, ref: "Player" },
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
    },
  })
  partnership?: {
    partner: Types.ObjectId;
    runs: number;
    balls: number;
  };

  // Player role in this match
  @Prop()
  role: string; // 'batsman', 'bowler', 'all_rounder', 'wicket_keeper', 'captain', 'vice_captain'

  @Prop({ default: false })
  isCaptain: boolean;

  @Prop({ default: false })
  isViceCaptain: boolean;

  @Prop({ default: false })
  isWicketKeeper: boolean;

  // Performance indicators
  @Prop({ default: 0 })
  fantasyPoints: number;

  @Prop({ default: false })
  manOfTheMatch: boolean;

  @Prop({ default: false })
  manOfTheInnings: boolean;

  // Additional metadata
  @Prop({ type: Object })
  metadata: any; // For any additional player-specific data
}

export const PlayerMatchStatsSchema =
  SchemaFactory.createForClass(PlayerMatchStats);

// Indexes for better performance
PlayerMatchStatsSchema.index(
  { matchId: 1, player: 1, innings: 1 },
  { unique: true }
);
PlayerMatchStatsSchema.index({ player: 1 });
PlayerMatchStatsSchema.index({ team: 1 });
PlayerMatchStatsSchema.index({ innings: 1 });
PlayerMatchStatsSchema.index({ battingRuns: -1 });
PlayerMatchStatsSchema.index({ bowlingWickets: -1 });
PlayerMatchStatsSchema.index({ fantasyPoints: -1 });
PlayerMatchStatsSchema.index({ manOfTheMatch: 1 });
PlayerMatchStatsSchema.index({ role: 1 });
