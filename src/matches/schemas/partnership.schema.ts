import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PartnershipDocument = Partnership & Document;

@Schema({ timestamps: true })
export class Partnership {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  innings: number;

  @Prop({ required: true })
  wicket: number; // Which wicket this partnership was for

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  player1: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  player2: Types.ObjectId;

  @Prop({ default: 0 })
  runs: number;

  @Prop({ default: 0 })
  balls: number;

  @Prop()
  startOver: number;

  @Prop()
  endOver: number;

  @Prop()
  startBall: number;

  @Prop()
  endBall: number;

  @Prop()
  duration: number; // in minutes

  @Prop({ default: 0 })
  runRate: number;

  @Prop({ default: false })
  isUnbroken: boolean;

  // Partnership milestones
  @Prop({ default: 0 })
  fifties: number; // Number of 50+ partnerships

  @Prop({ default: 0 })
  hundreds: number; // Number of 100+ partnerships

  @Prop({ default: 0 })
  twoHundreds: number; // Number of 200+ partnerships

  // Partnership type
  @Prop()
  type: string; // 'opening', 'middle_order', 'lower_order', 'tail_enders'

  // Partnership context
  @Prop()
  context: string; // 'recovery', 'consolidation', 'acceleration', 'finishing'

  // Key moments in partnership
  @Prop([
    {
      over: { type: Number, required: true },
      ball: { type: Number, required: true },
      event: { type: String, required: true }, // 'boundary', 'milestone', 'risk_shot', 'defensive'
      description: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ])
  keyMoments: Array<{
    over: number;
    ball: number;
    event: string;
    description?: string;
    timestamp: Date;
  }>;

  // Partnership statistics
  @Prop({ default: 0 })
  boundaries: number;

  @Prop({ default: 0 })
  sixes: number;

  @Prop({ default: 0 })
  dotBalls: number;

  @Prop({ default: 0 })
  singles: number;

  @Prop({ default: 0 })
  doubles: number;

  @Prop({ default: 0 })
  threes: number;

  // Partnership quality indicators
  @Prop({ default: 0 })
  partnershipQuality: number; // 0-100 score based on various factors

  @Prop({
    type: {
      pressureHandling: { type: Number, default: 0 },
      runRate: { type: Number, default: 0 },
      boundaryPercentage: { type: Number, default: 0 },
      partnershipDuration: { type: Number, default: 0 },
      matchContext: { type: Number, default: 0 },
    },
  })
  qualityFactors: {
    pressureHandling: number; // 0-10
    runRate: number; // 0-10
    boundaryPercentage: number; // 0-10
    partnershipDuration: number; // 0-10
    matchContext: number; // 0-10
  };

  // Additional metadata
  @Prop({ type: Object })
  metadata: any; // For any additional partnership-specific data
}

export const PartnershipSchema = SchemaFactory.createForClass(Partnership);

// Indexes for better performance
PartnershipSchema.index(
  { matchId: 1, innings: 1, wicket: 1 },
  { unique: true }
);
PartnershipSchema.index({ player1: 1, player2: 1 });
PartnershipSchema.index({ runs: -1 }); // For best partnerships queries
PartnershipSchema.index({ balls: -1 }); // For longest partnerships
PartnershipSchema.index({ duration: -1 }); // For longest duration partnerships
PartnershipSchema.index({ runRate: -1 }); // For fastest partnerships
PartnershipSchema.index({ partnershipQuality: -1 }); // For quality partnerships
PartnershipSchema.index({ type: 1 });
PartnershipSchema.index({ context: 1 });
PartnershipSchema.index({ isUnbroken: 1 });
PartnershipSchema.index({ hundreds: 1 });
PartnershipSchema.index({ fifties: 1 });
