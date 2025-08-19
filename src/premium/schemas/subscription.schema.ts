import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  planType: string; // 'BASIC', 'PREMIUM', 'PRO', 'ENTERPRISE'

  @Prop({ required: true })
  planName: string;

  @Prop({ required: true })
  planDescription: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string; // 'USD', 'INR', 'EUR', etc.

  @Prop({ required: true })
  billingCycle: string; // 'MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME'

  @Prop({ required: true })
  status: string; // 'ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING', 'FAILED'

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  cancellationReason: string;

  @Prop({ default: false })
  autoRenew: boolean;

  @Prop({ default: 0 })
  trialDays: number;

  @Prop()
  trialEndDate: Date;

  @Prop({
    type: [
      {
        feature: { type: String, required: true },
        description: { type: String },
        isEnabled: { type: Boolean, default: true },
      },
    ],
  })
  features: Array<{
    feature: string;
    description: string;
    isEnabled: boolean;
  }>;

  @Prop({
    type: {
      maxMatches: { type: Number, default: 0 },
      maxPlayers: { type: Number, default: 0 },
      maxTeams: { type: Number, default: 0 },
      maxUsers: { type: Number, default: 0 },
      maxStorage: { type: Number, default: 0 }, // in MB
      maxApiCalls: { type: Number, default: 0 },
      prioritySupport: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
      advancedAnalytics: { type: Boolean, default: false },
      adFree: { type: Boolean, default: false },
    },
  })
  limits: {
    maxMatches: number;
    maxPlayers: number;
    maxTeams: number;
    maxUsers: number;
    maxStorage: number;
    maxApiCalls: number;
    prioritySupport: boolean;
    customBranding: boolean;
    advancedAnalytics: boolean;
    adFree: boolean;
  };

  @Prop({ type: Types.ObjectId, ref: "Payment" })
  lastPayment: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Payment" }] })
  paymentHistory: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

// Indexes
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ planType: 1 });
SubscriptionSchema.index({ startDate: 1, endDate: 1 });
SubscriptionSchema.index({ isActive: 1 });
