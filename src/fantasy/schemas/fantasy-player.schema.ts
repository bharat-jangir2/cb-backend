import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FantasyPlayerDocument = FantasyPlayer & Document;

@Schema({ timestamps: true })
export class FantasyPlayer {
  @Prop({ type: Types.ObjectId, ref: "Player", required: true })
  playerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "FantasyLeague" })
  leagueId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  format: string; // 'T20', 'ODI', 'TEST'

  // Fantasy Points
  @Prop({
    type: {
      batting: { type: Number, default: 0 },
      bowling: { type: Number, default: 0 },
      fielding: { type: Number, default: 0 },
      bonus: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  })
  points: {
    batting: number;
    bowling: number;
    fielding: number;
    bonus: number;
    total: number;
  };

  // Performance Details
  @Prop({
    type: {
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      catches: { type: Number, default: 0 },
      stumpings: { type: Number, default: 0 },
      runOuts: { type: Number, default: 0 },
      fifties: { type: Number, default: 0 },
      hundreds: { type: Number, default: 0 },
      fourWickets: { type: Number, default: 0 },
      fiveWickets: { type: Number, default: 0 },
      maidenOvers: { type: Number, default: 0 },
      economyBonus: { type: Number, default: 0 },
      strikeRateBonus: { type: Number, default: 0 },
    },
  })
  performance: {
    runs: number;
    wickets: number;
    catches: number;
    stumpings: number;
    runOuts: number;
    fifties: number;
    hundreds: number;
    fourWickets: number;
    fiveWickets: number;
    maidenOvers: number;
    economyBonus: number;
    strikeRateBonus: number;
  };

  // Captain/Vice-Captain Multipliers
  @Prop({
    type: {
      captainMultiplier: { type: Number, default: 1 },
      viceCaptainMultiplier: { type: Number, default: 1.5 },
      isCaptain: { type: Boolean, default: false },
      isViceCaptain: { type: Boolean, default: false },
    },
  })
  captaincy: {
    captainMultiplier: number;
    viceCaptainMultiplier: number;
    isCaptain: boolean;
    isViceCaptain: boolean;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const FantasyPlayerSchema = SchemaFactory.createForClass(FantasyPlayer);

// Indexes
FantasyPlayerSchema.index({ playerId: 1, leagueId: 1 });
FantasyPlayerSchema.index({ matchId: 1 });
FantasyPlayerSchema.index({ "points.total": -1 });
FantasyPlayerSchema.index({ isActive: 1 });
