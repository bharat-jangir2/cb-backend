import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; // 'GENERAL', 'HISTORY', 'STATS', 'RULES', 'PLAYERS', 'TEAMS'

  @Prop({ required: true })
  difficulty: string; // 'EASY', 'MEDIUM', 'HARD', 'EXPERT'

  @Prop({ default: 0 })
  timeLimit: number; // in seconds, 0 for no limit

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ default: 0 })
  totalPoints: number;

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }, // index of correct option
        explanation: { type: String },
        points: { type: Number, default: 1 },
        imageUrl: { type: String },
      },
    ],
  })
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    points: number;
    imageUrl?: string;
  }>;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: 0 })
  averageScore: number;

  @Prop({ default: 0 })
  highestScore: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

// Indexes
QuizSchema.index({ title: "text", description: "text" });
QuizSchema.index({ category: 1, difficulty: 1 });
QuizSchema.index({ createdBy: 1 });
QuizSchema.index({ isPublished: 1, isActive: 1 });
QuizSchema.index({ isFeatured: 1, createdAt: -1 });
QuizSchema.index({ averageScore: -1 });
QuizSchema.index({ attempts: -1 });
