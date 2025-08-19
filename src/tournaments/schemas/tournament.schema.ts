import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TournamentDocument = Tournament & Document;

@Schema({ timestamps: true })
export class Tournament {
  @Prop({ required: true })
  name: string;

  @Prop()
  shortName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  format: string; // 'T20', 'ODI', 'TEST', 'MIXED'

  @Prop({ required: true })
  type: string; // 'LEAGUE', 'KNOCKOUT', 'ROUND_ROBIN', 'SUPER_LEAGUE'

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

  @Prop()
  organizer: string;

  @Prop()
  prizeMoney: number;

  @Prop()
  logoUrl: string;

  @Prop()
  bannerUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Team" }] })
  participatingTeams: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "Match" }] })
  matches: Types.ObjectId[];

  @Prop({
    type: {
      totalMatches: { type: Number, default: 0 },
      completedMatches: { type: Number, default: 0 },
      totalTeams: { type: Number, default: 0 },
      totalPlayers: { type: Number, default: 0 },
    },
  })
  stats: {
    totalMatches: number;
    completedMatches: number;
    totalTeams: number;
    totalPlayers: number;
  };

  @Prop({
    type: {
      groupStage: { type: Boolean, default: false },
      knockoutStage: { type: Boolean, default: false },
      finalStage: { type: Boolean, default: false },
    },
  })
  stages: {
    groupStage: boolean;
    knockoutStage: boolean;
    finalStage: boolean;
  };

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        description: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        status: { type: String, default: "UPCOMING" }, // 'UPCOMING', 'LIVE', 'COMPLETED'
        matches: [{ type: Types.ObjectId, ref: "Match" }],
      },
    ],
  })
  groups: Array<{
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    matches: Types.ObjectId[];
  }>;

  @Prop({
    type: [
      {
        position: { type: Number, required: true },
        team: { type: Types.ObjectId, ref: "Team", required: true },
        played: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        tied: { type: Number, default: 0 },
        noResult: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        netRunRate: { type: Number, default: 0 },
        runsFor: { type: Number, default: 0 },
        runsAgainst: { type: Number, default: 0 },
        oversFor: { type: Number, default: 0 },
        oversAgainst: { type: Number, default: 0 },
      },
    ],
  })
  pointsTable: Array<{
    position: number;
    team: Types.ObjectId;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    netRunRate: number;
    runsFor: number;
    runsAgainst: number;
    oversFor: number;
    oversAgainst: number;
  }>;

  @Prop({
    type: {
      winner: { type: Types.ObjectId, ref: "Team" },
      runnerUp: { type: Types.ObjectId, ref: "Team" },
      thirdPlace: { type: Types.ObjectId, ref: "Team" },
      manOfTheSeries: { type: Types.ObjectId, ref: "Player" },
      bestBatsman: { type: Types.ObjectId, ref: "Player" },
      bestBowler: { type: Types.ObjectId, ref: "Player" },
      bestFielder: { type: Types.ObjectId, ref: "Player" },
    },
  })
  results: {
    winner?: Types.ObjectId;
    runnerUp?: Types.ObjectId;
    thirdPlace?: Types.ObjectId;
    manOfTheSeries?: Types.ObjectId;
    bestBatsman?: Types.ObjectId;
    bestBowler?: Types.ObjectId;
    bestFielder?: Types.ObjectId;
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

export const TournamentSchema = SchemaFactory.createForClass(Tournament);

// Indexes
TournamentSchema.index({ name: "text", description: "text" });
TournamentSchema.index({ status: 1, startDate: 1 });
TournamentSchema.index({ country: 1, status: 1 });
TournamentSchema.index({ format: 1, type: 1 });
TournamentSchema.index({ isActive: 1 });
