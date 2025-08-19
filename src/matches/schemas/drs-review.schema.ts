import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DRSReviewDocument = DRSReview & Document;

@Schema({ timestamps: true })
export class DRSReview {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  innings: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  reviewType: string; // 'lbw', 'caught', 'stumped', 'run_out'

  @Prop({ required: true, type: Types.ObjectId, ref: "Team" })
  requestingTeam: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  requestingPlayer: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Player" })
  reviewedPlayer: Types.ObjectId;

  @Prop({ required: true })
  originalDecision: string; // 'out', 'not_out'

  @Prop()
  finalDecision: string; // 'upheld', 'struck_down', 'umpires_call'

  @Prop()
  reason: string;

  @Prop({ default: 0 })
  reviewTime: number; // seconds taken for review

  // Review details
  @Prop()
  reviewStartTime: Date;

  @Prop()
  reviewEndTime: Date;

  @Prop()
  reviewDuration: number; // in seconds

  // Review technology used
  @Prop([String])
  technologiesUsed: string[]; // 'hawk_eye', 'snicko', 'hot_spot', 'ball_tracking', 'ultra_edge'

  // Review angles
  @Prop([String])
  anglesReviewed: string[]; // 'front_on', 'side_on', 'overhead', 'close_up'

  // Review outcome details
  @Prop()
  outcomeReason: string; // Detailed reason for the final decision

  @Prop()
  umpireNotes: string; // Notes from the umpire

  @Prop()
  thirdUmpireNotes: string; // Notes from the third umpire

  // Review impact
  @Prop({ default: 0 })
  impactScore: number; // 0-100 score indicating review importance

  @Prop()
  impactDescription: string; // Description of the review's impact on the match

  // Review statistics
  @Prop({ default: false })
  wasSuccessful: boolean; // Whether the review was successful for the requesting team

  @Prop({ default: false })
  wasClose: boolean; // Whether it was a close call

  @Prop({ default: false })
  wasControversial: boolean; // Whether the review was controversial

  // Review metadata
  @Prop({ type: Object })
  metadata: any; // For any additional review-specific data

  // Review status
  @Prop({ default: "pending" })
  status: string; // 'pending', 'in_progress', 'completed', 'cancelled'

  // Review processing
  @Prop({ default: false })
  processed: boolean;

  @Prop()
  processedAt: Date;

  @Prop()
  processingNotes: string;
}

export const DRSReviewSchema = SchemaFactory.createForClass(DRSReview);

// Indexes for better performance
DRSReviewSchema.index({ matchId: 1, innings: 1, ball: 1 }, { unique: true });
DRSReviewSchema.index({ matchId: 1, reviewType: 1 });
DRSReviewSchema.index({ requestingTeam: 1 });
DRSReviewSchema.index({ requestingPlayer: 1 });
DRSReviewSchema.index({ reviewedPlayer: 1 });
DRSReviewSchema.index({ originalDecision: 1 });
DRSReviewSchema.index({ finalDecision: 1 });
DRSReviewSchema.index({ wasSuccessful: 1 });
DRSReviewSchema.index({ wasControversial: 1 });
DRSReviewSchema.index({ impactScore: -1 });
DRSReviewSchema.index({ reviewTime: -1 });
DRSReviewSchema.index({ status: 1 });
DRSReviewSchema.index({ processed: 1 });
DRSReviewSchema.index({ timestamp: -1 });
