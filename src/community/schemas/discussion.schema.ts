import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DiscussionDocument = Discussion & Document;

@Schema({ timestamps: true })
export class Discussion {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  category: string; // 'GENERAL', 'MATCH_DISCUSSION', 'PLAYER_TALK', 'TEAM_TALK', 'TACTICS'

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  likedBy: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: "Match" })
  relatedMatch: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Player" })
  relatedPlayer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Team" })
  relatedTeam: Types.ObjectId;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ default: false })
  isModerated: boolean;

  @Prop()
  moderationReason: string;

  @Prop({ default: 0 })
  reportCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  reportedBy: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);

// Indexes
DiscussionSchema.index({ title: "text", content: "text" });
DiscussionSchema.index({ category: 1, createdAt: -1 });
DiscussionSchema.index({ userId: 1 });
DiscussionSchema.index({ relatedMatch: 1 });
DiscussionSchema.index({ relatedPlayer: 1 });
DiscussionSchema.index({ relatedTeam: 1 });
DiscussionSchema.index({ isPinned: 1, createdAt: -1 });
DiscussionSchema.index({ likeCount: -1 });
DiscussionSchema.index({ replyCount: -1 });
DiscussionSchema.index({ isActive: 1 });
