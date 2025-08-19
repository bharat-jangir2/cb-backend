import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FantasyTeamDocument = FantasyTeam & Document;

@Schema({ timestamps: true })
export class FantasyTeam {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "FantasyLeague", required: true })
  leagueId: Types.ObjectId;

  @Prop({ required: true })
  teamName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Player" }] })
  players: Types.ObjectId[];

  @Prop({
    type: {
      batsmen: [{ type: Types.ObjectId, ref: "Player" }],
      bowlers: [{ type: Types.ObjectId, ref: "Player" }],
      allRounders: [{ type: Types.ObjectId, ref: "Player" }],
      wicketKeepers: [{ type: Types.ObjectId, ref: "Player" }],
    },
  })
  teamComposition: {
    batsmen: Types.ObjectId[];
    bowlers: Types.ObjectId[];
    allRounders: Types.ObjectId[];
    wicketKeepers: Types.ObjectId[];
  };

  @Prop({
    type: {
      captain: { type: Types.ObjectId, ref: "Player" },
      viceCaptain: { type: Types.ObjectId, ref: "Player" },
    },
  })
  captaincy: {
    captain: Types.ObjectId;
    viceCaptain: Types.ObjectId;
  };

  @Prop({ default: 0 })
  totalPoints: number;

  @Prop({ default: 0 })
  rank: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const FantasyTeamSchema = SchemaFactory.createForClass(FantasyTeam);

// Indexes
FantasyTeamSchema.index({ userId: 1, leagueId: 1 });
FantasyTeamSchema.index({ leagueId: 1, totalPoints: -1 });
FantasyTeamSchema.index({ leagueId: 1, rank: 1 });
FantasyTeamSchema.index({ isActive: 1 });
