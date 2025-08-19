import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MatchEventDocument = MatchEvent & Document;

@Schema({ timestamps: true })
export class MatchEvent {
  @Prop({ required: true, type: Types.ObjectId, ref: "Match" })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  eventType: string; // 'toss', 'innings_start', 'innings_end', 'match_end', 'milestone', 'review', 'break', 'resume', 'power_play_start', 'power_play_end', 'wicket', 'boundary', 'partnership', 'over_complete', 'drinks', 'strategic_timeout', 'highlight', 'notification', 'commentary'

  @Prop({ required: true })
  event: string; // Event title

  @Prop({ required: true })
  description: string; // Event description

  @Prop({ required: true })
  time: Date;

  // Match context
  @Prop()
  ball: number;

  @Prop()
  over: number;

  @Prop()
  innings: number;

  // Players involved
  @Prop([{ type: Types.ObjectId, ref: "Player" }])
  players: Types.ObjectId[];

  // Teams involved
  @Prop([{ type: Types.ObjectId, ref: "Team" }])
  teams: Types.ObjectId[];

  // Event category
  @Prop()
  category: string; // 'match_control', 'scoring', 'player_action', 'team_action', 'system', 'highlight', 'notification'

  // Event priority
  @Prop({ default: "normal" })
  priority: string; // 'low', 'normal', 'high', 'critical'

  // Event visibility
  @Prop({ default: true })
  isPublic: boolean; // Whether this event should be shown to all users

  @Prop({ default: false })
  isHighlight: boolean; // Whether this is a highlight event

  @Prop({ default: false })
  isNotification: boolean; // Whether this should trigger a notification

  // Highlight specific fields
  @Prop()
  highlightTitle: string;

  @Prop()
  highlightDescription: string;

  @Prop()
  videoUrl: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: false })
  isFeatured: boolean;

  // Notification specific fields
  @Prop()
  notificationType: string; // 'push', 'email', 'sms', 'in_app'

  @Prop()
  notificationTitle: string;

  @Prop()
  notificationMessage: string;

  @Prop({ default: false })
  notificationSent: boolean;

  @Prop()
  notificationSentAt: Date;

  // Commentary specific fields
  @Prop()
  commentary: string;

  @Prop()
  commentator: string;

  @Prop()
  commentaryType: string; // 'ball_by_ball', 'over_summary', 'innings_summary', 'match_summary', 'expert_analysis'

  // Event metadata
  @Prop({ type: Object })
  metadata: any; // For any additional event-specific data

  // Event tags for filtering
  @Prop([String])
  tags: string[];

  // Event impact
  @Prop({ default: 0 })
  impactScore: number; // 0-100 score indicating event importance

  // Event relationships
  @Prop({ type: Types.ObjectId, ref: "MatchEvent" })
  relatedEvent: Types.ObjectId; // Link to related events

  @Prop([{ type: Types.ObjectId, ref: "MatchEvent" }])
  childEvents: Types.ObjectId[]; // Sub-events

  // Event status
  @Prop({ default: "active" })
  status: string; // 'active', 'archived', 'deleted'

  // Event source
  @Prop()
  source: string; // 'manual', 'automatic', 'system', 'api', 'websocket'

  // Event processing
  @Prop({ default: false })
  processed: boolean;

  @Prop()
  processedAt: Date;

  @Prop()
  processingNotes: string;
}

export const MatchEventSchema = SchemaFactory.createForClass(MatchEvent);

// Indexes for better performance
MatchEventSchema.index({ matchId: 1, time: -1 });
MatchEventSchema.index({ matchId: 1, eventType: 1 });
MatchEventSchema.index({ matchId: 1, category: 1 });
MatchEventSchema.index({ matchId: 1, innings: 1 });
MatchEventSchema.index({ eventType: 1 });
MatchEventSchema.index({ category: 1 });
MatchEventSchema.index({ priority: 1 });
MatchEventSchema.index({ isHighlight: 1 });
MatchEventSchema.index({ isNotification: 1 });
MatchEventSchema.index({ isFeatured: 1 });
MatchEventSchema.index({ players: 1 });
MatchEventSchema.index({ teams: 1 });
MatchEventSchema.index({ tags: 1 });
MatchEventSchema.index({ impactScore: -1 });
MatchEventSchema.index({ status: 1 });
MatchEventSchema.index({ source: 1 });
MatchEventSchema.index({ processed: 1 });
MatchEventSchema.index({ time: -1 }); // For timeline queries
