import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type AgentDocument = Agent & Document;

export enum AgentStatus {
  RUNNING = "running",
  PAUSED = "paused",
  STOPPED = "stopped",
  ERROR = "error",
}

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match", unique: true })
  matchId: Types.ObjectId;

  @Prop({ required: true, enum: AgentStatus, default: AgentStatus.STOPPED })
  status: AgentStatus;

  @Prop()
  startedAt?: Date;

  @Prop()
  stoppedAt?: Date;

  @Prop()
  pausedAt?: Date;

  @Prop()
  lastActivityAt?: Date;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Object })
  config?: {
    updateInterval: number; // milliseconds
    autoUpdateOdds: boolean;
    autoReviewBalls: boolean;
    confidenceThreshold: number;
    enableMatchSetup: boolean;
    enablePostMatchHandling: boolean;
    enableDataValidation: boolean;
    enableAdminAutomation: boolean;
    retryAttempts: number;
    retryDelay: number;
  };

  @Prop({ type: Object })
  stats?: {
    ballsProcessed: number;
    oddsUpdates: number;
    alertsGenerated: number;
    lastProcessedBall?: Types.ObjectId;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

// Indexes for better query performance
AgentSchema.index({ matchId: 1 });
AgentSchema.index({ status: 1 });
AgentSchema.index({ isActive: 1 });
