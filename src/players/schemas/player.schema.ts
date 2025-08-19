import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlayerRole } from '../../common/enums/player-role.enum';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  shortName: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: true, enum: PlayerRole })
  role: PlayerRole;

  @Prop()
  battingStyle?: string;

  @Prop()
  bowlingStyle?: string;

  @Prop({ type: Object })
  careerStats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    catches?: number;
    stumpings?: number;
    fifties?: number;
    hundreds?: number;
    fiveWickets?: number;
    tenWickets?: number;
  };

  @Prop()
  photoUrl?: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  height?: string;

  @Prop()
  weight?: string;

  @Prop()
  debutDate?: Date;

  @Prop()
  lastMatchDate?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

// Indexes for better query performance
PlayerSchema.index({ fullName: 1 });
PlayerSchema.index({ shortName: 1 });
PlayerSchema.index({ nationality: 1 });
PlayerSchema.index({ role: 1 });
PlayerSchema.index({ status: 1 });
PlayerSchema.index({ isActive: 1 }); 