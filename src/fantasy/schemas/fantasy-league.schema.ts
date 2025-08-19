import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FantasyLeagueDocument = FantasyLeague & Document;

@Schema({ timestamps: true })
export class FantasyLeague {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  type: string; // 'PUBLIC', 'PRIVATE', 'PAID'

  @Prop({ required: true })
  status: string; // 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: "Match" })
  relatedMatch: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Tournament" })
  relatedTournament: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Series" })
  relatedSeries: Types.ObjectId;

  @Prop({ required: true })
  entryFee: number;

  @Prop({ required: true })
  prizePool: number;

  @Prop({ required: true })
  maxTeams: number;

  @Prop({ default: 0 })
  currentTeams: number;

  @Prop({ required: true })
  maxPlayersPerTeam: number;

  @Prop({
    type: {
      batsmen: { type: Number, required: true },
      bowlers: { type: Number, required: true },
      allRounders: { type: Number, required: true },
      wicketKeepers: { type: Number, required: true },
    },
  })
  teamComposition: {
    batsmen: number;
    bowlers: number;
    allRounders: number;
    wicketKeepers: number;
  };

  @Prop({
    type: {
      runs: { type: Number, default: 1 },
      wickets: { type: Number, default: 10 },
      catches: { type: Number, default: 4 },
      stumpings: { type: Number, default: 6 },
      runOuts: { type: Number, default: 4 },
      fifties: { type: Number, default: 8 },
      hundreds: { type: Number, default: 16 },
      fourWickets: { type: Number, default: 8 },
      fiveWickets: { type: Number, default: 16 },
      maidenOvers: { type: Number, default: 4 },
      economyBonus: { type: Number, default: 4 },
      strikeRateBonus: { type: Number, default: 4 },
    },
  })
  scoringRules: {
    runs: number;
    wickets: number;
    catches: number;
    stumpings: number;
    runOuts: number;
    fifties: number;
    hundreds: number;
    fourWickets: number;
    fiveWickets: number;
    maidenOvers: number;
    economyBonus: number;
    strikeRateBonus: number;
  };

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

export const FantasyLeagueSchema = SchemaFactory.createForClass(FantasyLeague);

// Indexes
FantasyLeagueSchema.index({ name: "text", description: "text" });
FantasyLeagueSchema.index({ status: 1, startDate: 1 });
FantasyLeagueSchema.index({ type: 1, status: 1 });
FantasyLeagueSchema.index({ relatedMatch: 1 });
FantasyLeagueSchema.index({ relatedTournament: 1 });
FantasyLeagueSchema.index({ relatedSeries: 1 });
FantasyLeagueSchema.index({ isActive: 1 });
