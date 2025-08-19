import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type SeriesDocument = Series & Document;

@Schema({ timestamps: true })
export class Series {
  @Prop({ required: true })
  name: string;

  @Prop()
  shortName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string; // 'BILATERAL', 'MULTILATERAL', 'TRI_SERIES', 'QUAD_SERIES'

  @Prop({ required: true })
  format: string; // 'T20', 'ODI', 'TEST', 'MIXED'

  @Prop({ required: true })
  status: string; // 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  venue: string;

  @Prop()
  country: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Team" }] })
  participatingTeams: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Match" }] })
  matches: Types.ObjectId[];

  @Prop({
    type: {
      totalMatches: { type: Number, default: 0 },
      completedMatches: { type: Number, default: 0 },
      totalTeams: { type: Number, default: 0 },
    },
  })
  stats: {
    totalMatches: number;
    completedMatches: number;
    totalTeams: number;
  };

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: "Team", required: true },
        played: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        tied: { type: Number, default: 0 },
        noResult: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        netRunRate: { type: Number, default: 0 },
      },
    ],
  })
  seriesTable: Array<{
    team: Types.ObjectId;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    netRunRate: number;
  }>;

  @Prop({
    type: {
      winner: { type: Types.ObjectId, ref: "Team" },
      runnerUp: { type: Types.ObjectId, ref: "Team" },
      manOfTheSeries: { type: Types.ObjectId, ref: "Player" },
      bestBatsman: { type: Types.ObjectId, ref: "Player" },
      bestBowler: { type: Types.ObjectId, ref: "Player" },
    },
  })
  results: {
    winner?: Types.ObjectId;
    runnerUp?: Types.ObjectId;
    manOfTheSeries?: Types.ObjectId;
    bestBatsman?: Types.ObjectId;
    bestBowler?: Types.ObjectId;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  rules: string;

  @Prop()
  terms: string;

  @Prop({
    type: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
  })
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export const SeriesSchema = SchemaFactory.createForClass(Series);

// Indexes
SeriesSchema.index({ name: "text", description: "text" });
SeriesSchema.index({ status: 1, startDate: 1 });
SeriesSchema.index({ country: 1, status: 1 });
SeriesSchema.index({ format: 1, type: 1 });
SeriesSchema.index({ isActive: 1 });
