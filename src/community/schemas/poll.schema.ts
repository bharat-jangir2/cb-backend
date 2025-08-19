import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PollDocument = Poll & Document;

@Schema({ timestamps: true })
export class Poll {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string; // 'GENERAL', 'MATCH_PREDICTION', 'PLAYER_RATING', 'TEAM_PERFORMANCE', 'OPINION'

  @Prop({
    type: [
      {
        option: { type: String, required: true },
        votes: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
      },
    ],
  })
  options: Array<{
    option: string;
    votes: number;
    percentage: number;
  }>;

  @Prop({ default: 0 })
  totalVotes: number;

  @Prop({ default: false })
  allowMultipleVotes: boolean;

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: "Match" })
  relatedMatch: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Player" })
  relatedPlayer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Team" })
  relatedTeam: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  votedBy: Types.ObjectId[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const PollSchema = SchemaFactory.createForClass(Poll);

// Indexes
PollSchema.index({ question: "text", description: "text" });
PollSchema.index({ category: 1, createdAt: -1 });
PollSchema.index({ createdBy: 1 });
PollSchema.index({ isPublished: 1, isActive: 1 });
PollSchema.index({ isFeatured: 1, createdAt: -1 });
PollSchema.index({ totalVotes: -1 });
PollSchema.index({ relatedMatch: 1 });
PollSchema.index({ relatedPlayer: 1 });
PollSchema.index({ relatedTeam: 1 });
