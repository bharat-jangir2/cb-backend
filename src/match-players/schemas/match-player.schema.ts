import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatchPlayerDocument = MatchPlayer & Document;

@Schema({ timestamps: true })
export class MatchPlayer {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Match' })
  matchId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Player' })
  playerId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Team' })
  teamId: Types.ObjectId;

  @Prop({ required: true })
  roleInMatch: string; // 'batsman', 'bowler', 'wicket-keeper', 'all-rounder'

  @Prop()
  battingOrder?: number;

  @Prop()
  bowlingOrder?: number;

  @Prop({ default: false })
  isCaptain: boolean;

  @Prop({ default: false })
  isViceCaptain: boolean;

  @Prop()
  jerseyNumber?: number;

  @Prop({ type: Object })
  matchStats?: {
    batting?: {
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      dismissalType?: string;
      dismissedBy?: Types.ObjectId;
      caughtBy?: Types.ObjectId;
      runOutBy?: Types.ObjectId;
    };
    bowling?: {
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
      economy: number;
      extras: number;
      wides: number;
      noBalls: number;
    };
    fielding?: {
      catches: number;
      stumpings: number;
      runOuts: number;
    };
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const MatchPlayerSchema = SchemaFactory.createForClass(MatchPlayer);

// Indexes for better query performance
MatchPlayerSchema.index({ matchId: 1 });
MatchPlayerSchema.index({ playerId: 1 });
MatchPlayerSchema.index({ teamId: 1 });
MatchPlayerSchema.index({ isActive: 1 });
MatchPlayerSchema.index({ matchId: 1, teamId: 1 });
MatchPlayerSchema.index({ matchId: 1, battingOrder: 1 });
MatchPlayerSchema.index({ matchId: 1, bowlingOrder: 1 }); 