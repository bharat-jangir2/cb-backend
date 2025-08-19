import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { PremiumService } from "./premium.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("premium")
@Controller("api/premium")
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}

  // Subscription methods
  @Post("subscriptions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create subscription" })
  @ApiResponse({ status: 201, description: "Subscription created successfully" })
  createSubscription(@Body() createSubscriptionDto: any) {
    return this.premiumService.createSubscription(createSubscriptionDto);
  }

  @Get("subscriptions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user subscriptions" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Subscriptions retrieved successfully" })
  getUserSubscriptions(@Query() query: PaginationQueryDto & { 
    status?: string;
  }) {
    return this.premiumService.getUserSubscriptions(query);
  }

  @Get("subscriptions/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get subscription by ID" })
  @ApiResponse({ status: 200, description: "Subscription retrieved successfully" })
  getSubscriptionById(@Param("id") id: string) {
    return this.premiumService.getSubscriptionById(id);
  }

  @Patch("subscriptions/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update subscription" })
  @ApiResponse({ status: 200, description: "Subscription updated successfully" })
  updateSubscription(@Param("id") id: string, @Body() updateSubscriptionDto: any) {
    return this.premiumService.updateSubscription(id, updateSubscriptionDto);
  }

  @Post("subscriptions/:id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel subscription" })
  @ApiResponse({ status: 200, description: "Subscription cancelled successfully" })
  cancelSubscription(@Param("id") id: string, @Body() cancelDto: any) {
    return this.premiumService.cancelSubscription(id, cancelDto);
  }

  @Post("subscriptions/:id/renew")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Renew subscription" })
  @ApiResponse({ status: 200, description: "Subscription renewed successfully" })
  renewSubscription(@Param("id") id: string) {
    return this.premiumService.renewSubscription(id);
  }

  // Premium Features
  @Get("features")
  @ApiOperation({ summary: "Get premium features" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "planType", required: false, type: String })
  @ApiResponse({ status: 200, description: "Premium features retrieved successfully" })
  getPremiumFeatures(@Query() query: PaginationQueryDto & { 
    category?: string;
    planType?: string;
  }) {
    return this.premiumService.getPremiumFeatures(query);
  }

  @Get("features/:id")
  @ApiOperation({ summary: "Get premium feature by ID" })
  @ApiResponse({ status: 200, description: "Premium feature retrieved successfully" })
  getPremiumFeatureById(@Param("id") id: string) {
    return this.premiumService.getPremiumFeatureById(id);
  }

  @Post("features")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create premium feature" })
  @ApiResponse({ status: 201, description: "Premium feature created successfully" })
  createPremiumFeature(@Body() createFeatureDto: any) {
    return this.premiumService.createPremiumFeature(createFeatureDto);
  }

  @Patch("features/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update premium feature" })
  @ApiResponse({ status: 200, description: "Premium feature updated successfully" })
  updatePremiumFeature(@Param("id") id: string, @Body() updateFeatureDto: any) {
    return this.premiumService.updatePremiumFeature(id, updateFeatureDto);
  }

  // Payment methods
  @Post("payments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create payment" })
  @ApiResponse({ status: 201, description: "Payment created successfully" })
  createPayment(@Body() createPaymentDto: any) {
    return this.premiumService.createPayment(createPaymentDto);
  }

  @Get("payments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user payments" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Payments retrieved successfully" })
  getUserPayments(@Query() query: PaginationQueryDto & { 
    status?: string;
  }) {
    return this.premiumService.getUserPayments(query);
  }

  @Get("payments/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get payment by ID" })
  @ApiResponse({ status: 200, description: "Payment retrieved successfully" })
  getPaymentById(@Param("id") id: string) {
    return this.premiumService.getPaymentById(id);
  }

  @Post("payments/:id/refund")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Refund payment" })
  @ApiResponse({ status: 200, description: "Payment refunded successfully" })
  refundPayment(@Param("id") id: string, @Body() refundDto: any) {
    return this.premiumService.refundPayment(id, refundDto);
  }

  // Plans and Pricing
  @Get("plans")
  @ApiOperation({ summary: "Get subscription plans" })
  @ApiResponse({ status: 200, description: "Subscription plans retrieved successfully" })
  getSubscriptionPlans() {
    return this.premiumService.getSubscriptionPlans();
  }

  @Get("plans/:type")
  @ApiOperation({ summary: "Get subscription plan by type" })
  @ApiResponse({ status: 200, description: "Subscription plan retrieved successfully" })
  getSubscriptionPlanByType(@Param("type") type: string) {
    return this.premiumService.getSubscriptionPlanByType(type);
  }

  // User Premium Status
  @Get("status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user premium status" })
  @ApiResponse({ status: 200, description: "Premium status retrieved successfully" })
  getUserPremiumStatus() {
    return this.premiumService.getUserPremiumStatus();
  }

  @Get("usage")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user feature usage" })
  @ApiResponse({ status: 200, description: "Feature usage retrieved successfully" })
  getUserFeatureUsage() {
    return this.premiumService.getUserFeatureUsage();
  }
} 