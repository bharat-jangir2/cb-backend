import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PremiumController } from "./premium.controller";
import { PremiumService } from "./premium.service";
import {
  Subscription,
  SubscriptionSchema,
} from "./schemas/subscription.schema";
import {
  PremiumFeature,
  PremiumFeatureSchema,
} from "./schemas/premium-feature.schema";
import { Payment, PaymentSchema } from "./schemas/payment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: PremiumFeature.name, schema: PremiumFeatureSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [PremiumController],
  providers: [PremiumService],
  exports: [PremiumService],
})
export class PremiumModule {}
