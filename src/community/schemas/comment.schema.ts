import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  entityType: string; // 'MATCH', 'NEWS', 'PLAYER', 'TEAM', 'TOURNAMENT', 'DISCUSSION'

  @Prop({ type: Types.ObjectId, required: true })
  entityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Comment" })
  parentComment: Types.ObjectId; // For nested comments

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  dislikeCount: number;

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  likedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  dislikedBy: Types.ObjectId[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  editedAt: Date;

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

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Indexes
CommentSchema.index({ entityType: 1, entityId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ likeCount: -1 });
CommentSchema.index({ isActive: 1 });
