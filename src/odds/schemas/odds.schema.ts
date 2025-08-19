import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OddsDocument = Odds & Document;

@Schema({ timestamps: true })
export class Odds {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Match' })
  matchId: Types.ObjectId;

  @Prop({ required: true, type: Object })
  snapshot: {
    teamA: {
      odds: number;
      probability: number;
      description?: string;
    };
    teamB: {
      odds: number;
      probability: number;
      description?: string;
    };
    draw?: {
      odds: number;
      probability: number;
      description?: string;
    };
    tie?: {
      odds: number;
      probability: number;
      description?: string;
    };
    // For live matches
    live?: {
      currentScore: {
        teamARuns: number;
        teamAWickets: number;
        teamAOvers: number;
        teamBRuns: number;
        teamBWickets: number;
        teamBOvers: number;
      };
      requiredRunRate?: number;
      currentRunRate?: number;
      oversRemaining?: number;
      wicketsRemaining?: number;
    };
  };

  @Prop()
  source: string; // 'manual', 'ai_agent', 'bookmaker'

  @Prop()
  confidence?: number; // 0-1 confidence level for AI predictions

  @Prop()
  notes?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const OddsSchema = SchemaFactory.createForClass(Odds);

// Indexes for better query performance
OddsSchema.index({ matchId: 1 });
OddsSchema.index({ matchId: 1, createdAt: -1 });
OddsSchema.index({ source: 1 });
OddsSchema.index({ isActive: 1 }); 