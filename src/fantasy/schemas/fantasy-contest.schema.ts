import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FantasyContestDocument = FantasyContest & Document;

@Schema({ timestamps: true })
export class FantasyContest {
  @Prop({ type: Types.ObjectId, ref: "FantasyLeague", required: true })
  leagueId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  entryFee: number;

  @Prop({ required: true })
  prizePool: number;

  @Prop({ required: true })
  maxTeams: number;

  @Prop({ default: 0 })
  currentTeams: number;

  @Prop({ required: true })
  status: string; // 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: [
      {
        rank: { type: Number, required: true },
        prize: { type: Number, required: true },
        percentage: { type: Number, required: true },
      },
    ],
  })
  prizeDistribution: Array<{
    rank: number;
    prize: number;
    percentage: number;
  }>;

  @Prop({ type: [{ type: Types.ObjectId, ref: "FantasyTeam" }] })
  teams: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  participants: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  rules: string;

  @Prop()
  terms: string;
}

export const FantasyContestSchema =
  SchemaFactory.createForClass(FantasyContest);

// Indexes
FantasyContestSchema.index({ leagueId: 1 });
FantasyContestSchema.index({ status: 1, startDate: 1 });
FantasyContestSchema.index({ isActive: 1 });
