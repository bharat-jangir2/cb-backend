import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  shortName: string;

  @Prop()
  logoUrl?: string;

  @Prop()
  homeVenue?: string;

  @Prop()
  captain?: string;

  @Prop()
  coach?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  foundedYear?: number;

  @Prop()
  description?: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

// Indexes for better query performance
TeamSchema.index({ name: 1 });
TeamSchema.index({ shortName: 1 });
TeamSchema.index({ isActive: 1 }); 