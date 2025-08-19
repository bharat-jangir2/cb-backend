import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  summary: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  category: string; // 'breaking', 'analysis', 'preview', 'review', 'transfer'

  @Prop([String])
  tags: string[];

  @Prop()
  imageUrl: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ type: Types.ObjectId, ref: "Match" })
  relatedMatch: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Player" })
  relatedPlayer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Team" })
  relatedTeam: Types.ObjectId;

  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop()
  seoTitle: string;

  @Prop()
  seoDescription: string;

  @Prop([String])
  seoKeywords: string[];
}

export const NewsSchema = SchemaFactory.createForClass(News);

// Indexes
NewsSchema.index({ title: "text", content: "text", tags: "text" });
NewsSchema.index({ category: 1, isPublished: 1 });
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ isFeatured: 1, publishedAt: -1 });
NewsSchema.index({ viewCount: -1 });
