import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Subscription" })
  subscriptionId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string; // 'USD', 'INR', 'EUR', etc.

  @Prop({ required: true })
  paymentMethod: string; // 'CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'STRIPE', 'BANK_TRANSFER'

  @Prop({ required: true })
  status: string; // 'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'

  @Prop({ required: true })
  gateway: string; // 'STRIPE', 'PAYPAL', 'RAZORPAY', etc.

  @Prop()
  gatewayTransactionId: string;

  @Prop()
  gatewayResponse: string;

  @Prop()
  failureReason: string;

  @Prop()
  refundReason: string;

  @Prop()
  refundedAt: Date;

  @Prop({ default: false })
  isRefunded: boolean;

  @Prop({
    type: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
  })
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Prop()
  notes: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ subscriptionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ gateway: 1 });
PaymentSchema.index({ gatewayTransactionId: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ isActive: 1 });
