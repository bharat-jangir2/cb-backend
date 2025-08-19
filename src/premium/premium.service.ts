import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Subscription, SubscriptionDocument } from "./schemas/subscription.schema";
import { PremiumFeature, PremiumFeatureDocument } from "./schemas/premium-feature.schema";
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@Injectable()
export class PremiumService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(PremiumFeature.name) private premiumFeatureModel: Model<PremiumFeatureDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>
  ) {}

  // Subscription methods
  async createSubscription(createSubscriptionDto: any): Promise<Subscription> {
    const subscription = new this.subscriptionModel(createSubscriptionDto);
    return subscription.save();
  }

  async getUserSubscriptions(query: PaginationQueryDto & { 
    status?: string;
  }): Promise<{ subscriptions: Subscription[]; total: number }> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (status) filter.status = status;

    const [subscriptions, total] = await Promise.all([
      this.subscriptionModel
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("lastPayment", "amount status gateway")
        .exec(),
      this.subscriptionModel.countDocuments(filter)
    ]);

    return { subscriptions, total };
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findById(id)
      .populate("lastPayment", "amount status gateway")
      .populate("paymentHistory", "amount status gateway createdAt")
      .exec();

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }

  async updateSubscription(id: string, updateSubscriptionDto: any): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(id, updateSubscriptionDto, { new: true })
      .populate("lastPayment", "amount status gateway")
      .exec();

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }

  async cancelSubscription(id: string, cancelDto: any): Promise<any> {
    const subscription = await this.subscriptionModel.findByIdAndUpdate(id, {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancellationReason: cancelDto.reason,
      autoRenew: false
    }, { new: true });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return { message: "Subscription cancelled successfully" };
  }

  async renewSubscription(id: string): Promise<any> {
    const subscription = await this.subscriptionModel.findById(id);
    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    // Calculate new end date based on billing cycle
    const newEndDate = new Date(subscription.endDate);
    switch (subscription.billingCycle) {
      case "MONTHLY":
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        break;
      case "QUARTERLY":
        newEndDate.setMonth(newEndDate.getMonth() + 3);
        break;
      case "YEARLY":
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        break;
    }

    await this.subscriptionModel.findByIdAndUpdate(id, {
      endDate: newEndDate,
      status: "ACTIVE",
      autoRenew: true
    });

    return { message: "Subscription renewed successfully" };
  }

  // Premium Features methods
  async getPremiumFeatures(query: PaginationQueryDto & { 
    category?: string;
    planType?: string;
  }): Promise<{ features: PremiumFeature[]; total: number }> {
    const { page = 1, limit = 10, category, planType } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (planType) filter.planType = planType;

    const [features, total] = await Promise.all([
      this.premiumFeatureModel
        .find(filter)
        .sort({ category: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.premiumFeatureModel.countDocuments(filter)
    ]);

    return { features, total };
  }

  async getPremiumFeatureById(id: string): Promise<PremiumFeature> {
    const feature = await this.premiumFeatureModel.findById(id).exec();

    if (!feature) {
      throw new NotFoundException("Premium feature not found");
    }

    return feature;
  }

  async createPremiumFeature(createFeatureDto: any): Promise<PremiumFeature> {
    const feature = new this.premiumFeatureModel(createFeatureDto);
    return feature.save();
  }

  async updatePremiumFeature(id: string, updateFeatureDto: any): Promise<PremiumFeature> {
    const feature = await this.premiumFeatureModel
      .findByIdAndUpdate(id, updateFeatureDto, { new: true })
      .exec();

    if (!feature) {
      throw new NotFoundException("Premium feature not found");
    }

    return feature;
  }

  // Payment methods
  async createPayment(createPaymentDto: any): Promise<Payment> {
    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async getUserPayments(query: PaginationQueryDto & { 
    status?: string;
  }): Promise<{ payments: Payment[]; total: number }> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (status) filter.status = status;

    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("subscriptionId", "planType planName")
        .exec(),
      this.paymentModel.countDocuments(filter)
    ]);

    return { payments, total };
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate("subscriptionId", "planType planName")
      .exec();

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return payment;
  }

  async refundPayment(id: string, refundDto: any): Promise<any> {
    const payment = await this.paymentModel.findByIdAndUpdate(id, {
      status: "REFUNDED",
      isRefunded: true,
      refundedAt: new Date(),
      refundReason: refundDto.reason
    }, { new: true });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return { message: "Payment refunded successfully" };
  }

  // Plans and Pricing
  async getSubscriptionPlans(): Promise<any> {
    const plans = [
      {
        type: "BASIC",
        name: "Basic Plan",
        description: "Essential features for casual users",
        price: 9.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        features: [
          "Live match updates",
          "Basic player stats",
          "Match schedules",
          "News access"
        ]
      },
      {
        type: "PREMIUM",
        name: "Premium Plan",
        description: "Advanced features for serious cricket fans",
        price: 19.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        features: [
          "All Basic features",
          "Advanced analytics",
          "Fantasy cricket",
          "Exclusive content",
          "Ad-free experience"
        ]
      },
      {
        type: "PRO",
        name: "Pro Plan",
        description: "Professional features for analysts and experts",
        price: 39.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        features: [
          "All Premium features",
          "Custom reports",
          "API access",
          "Priority support",
          "Data export"
        ]
      },
      {
        type: "ENTERPRISE",
        name: "Enterprise Plan",
        description: "Custom solutions for organizations",
        price: 99.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        features: [
          "All Pro features",
          "Custom integrations",
          "Dedicated support",
          "White-label options",
          "Advanced security"
        ]
      }
    ];

    return plans;
  }

  async getSubscriptionPlanByType(type: string): Promise<any> {
    const plans = await this.getSubscriptionPlans();
    const plan = plans.find(p => p.type === type.toUpperCase());
    
    if (!plan) {
      throw new NotFoundException("Subscription plan not found");
    }

    return plan;
  }

  // User Premium Status
  async getUserPremiumStatus(): Promise<any> {
    // This would typically get the current user's subscription status
    // For now, returning a mock response
    return {
      isPremium: true,
      planType: "PREMIUM",
      planName: "Premium Plan",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      autoRenew: true,
      features: [
        "Advanced analytics",
        "Fantasy cricket",
        "Exclusive content",
        "Ad-free experience"
      ]
    };
  }

  async getUserFeatureUsage(): Promise<any> {
    // This would typically get the current user's feature usage
    // For now, returning a mock response
    return {
      analytics: {
        used: 45,
        limit: 100,
        resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      fantasy: {
        used: 12,
        limit: 20,
        resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      api: {
        used: 1000,
        limit: 5000,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    };
  }
} 