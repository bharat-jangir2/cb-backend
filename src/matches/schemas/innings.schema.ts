import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type InningsDocument = Innings & Document;

@Schema({ timestamps: true })
export class Innings {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  inningsNumber: number; // 1 or 2

  @Prop({ required: true, type: Types.ObjectId, ref: "Team" })
  battingTeam: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Team" })
  bowlingTeam: Types.ObjectId;

  // Score details
  @Prop({ default: 0 })
  runs: number;

  @Prop({ default: 0 })
  wickets: number;

  @Prop({ default: 0 })
  overs: number;

  @Prop({ default: 0 })
  extras: number;

  @Prop({ default: 0 })
  boundaries: number;

  @Prop({ default: 0 })
  sixes: number;

  @Prop({ default: 0 })
  runRate: number;

  @Prop({ default: 0 })
  requiredRunRate: number;

  // Innings status
  @Prop({ default: "not_started" })
  status: string; // 'not_started', 'in_progress', 'completed', 'declared'

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  duration: number; // in minutes

  // Power play information
  @Prop({
    type: {
      isActive: { type: Boolean, default: false },
      currentPowerPlayIndex: { type: Number, default: -1 },
      type: { type: String },
      startOver: { type: Number },
      endOver: { type: Number },
      maxFieldersOutside: { type: Number, default: 2 },
    },
  })
  currentPowerPlay: {
    isActive: boolean;
    currentPowerPlayIndex: number;
    type?: string;
    startOver?: number;
    endOver?: number;
    maxFieldersOutside: number;
  };

  // Power plays for this innings
  @Prop([
    {
      type: { type: String, required: true }, // 'mandatory', 'batting', 'bowling'
      status: { type: String, default: "pending" }, // 'pending', 'active', 'completed'
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
  ])
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

  // Innings result
  @Prop()
  result: string; // 'all_out', 'target_reached', 'overs_completed', 'declaration'

  @Prop()
  resultDescription: string;

  // DRS reviews used
  @Prop({ default: 0 })
  drsReviewsUsed: number;

  @Prop({ default: 0 })
  drsReviewsRemaining: number;
}

export const InningsSchema = SchemaFactory.createForClass(Innings);

// Indexes for better performance
InningsSchema.index({ matchId: 1, inningsNumber: 1 }, { unique: true });
InningsSchema.index({ battingTeam: 1 });
InningsSchema.index({ bowlingTeam: 1 });
InningsSchema.index({ status: 1 });
InningsSchema.index({ "currentPowerPlay.isActive": 1 });
