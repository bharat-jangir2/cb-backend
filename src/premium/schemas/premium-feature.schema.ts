import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PremiumFeatureDocument = PremiumFeature & Document;

@Schema({ timestamps: true })
export class PremiumFeature {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; // 'ANALYTICS', 'CONTENT', 'FANTASY', 'COMMUNITY', 'PERSONALIZATION'

  @Prop({ required: true })
  type: string; // 'FEATURE', 'LIMIT_INCREASE', 'PRIORITY_ACCESS', 'EXCLUSIVE_CONTENT'

  @Prop({ required: true })
  planType: string; // 'BASIC', 'PREMIUM', 'PRO', 'ENTERPRISE'

  @Prop({ default: true })
  isEnabled: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  iconUrl: string;

  @Prop()
  documentation: string;

  @Prop({
    type: {
      maxUsage: { type: Number, default: 0 },
      currentUsage: { type: Number, default: 0 },
      resetPeriod: { type: String, default: "MONTHLY" }, // 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    }
  })
  limits: {
    maxUsage: number;
    currentUsage: number;
    resetPeriod: string;
  };

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const PremiumFeatureSchema = SchemaFactory.createForClass(PremiumFeature);

// Indexes
PremiumFeatureSchema.index({ name: 1 });
PremiumFeatureSchema.index({ category: 1 });
PremiumFeatureSchema.index({ planType: 1 });
PremiumFeatureSchema.index({ isEnabled: 1 });
PremiumFeatureSchema.index({ isActive: 1 }); 