import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BallDocument = Ball & Document;

@Schema({ timestamps: true })
export class Ball {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Match' })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  innings: number;

  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ required: true, type: Object })
  event: {
    type: 'runs' | 'wicket' | 'extra' | 'over_change' | 'innings_change';
    runs?: number;
    extras?: {
      type: 'wide' | 'no_ball' | 'bye' | 'leg_bye';
      runs: number;
      description?: string;
    };
    wicket?: {
      type: 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'obstructing' | 'handled_ball' | 'timed_out' | 'retired_out';
      batsman: Types.ObjectId;
      bowler?: Types.ObjectId;
      caughtBy?: Types.ObjectId;
      runOutBy?: Types.ObjectId;
      stumpedBy?: Types.ObjectId;
      description?: string;
    };
    overChange?: {
      newBowler: Types.ObjectId;
      reason?: string;
    };
    inningsChange?: {
      reason: 'all_out' | 'target_reached' | 'overs_completed' | 'declaration';
      description?: string;
    };
    description?: string;
  };

  @Prop({ type: Object })
  scoreState?: {
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

  @Prop()
  commentary?: string;

  @Prop()
  reviewed?: boolean;

  @Prop()
  reviewResult?: 'upheld' | 'struck_down' | 'umpires_call';
}

export const BallSchema = SchemaFactory.createForClass(Ball);

// Indexes for better query performance
BallSchema.index({ matchId: 1 });
BallSchema.index({ matchId: 1, innings: 1 });
BallSchema.index({ matchId: 1, innings: 1, over: 1 });
BallSchema.index({ matchId: 1, innings: 1, over: 1, ball: 1 });
BallSchema.index({ createdAt: 1 }); 