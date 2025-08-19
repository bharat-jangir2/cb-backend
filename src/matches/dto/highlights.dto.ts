import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsArray,
} from "class-validator";

export enum HighlightType {
  BOUNDARY = "boundary",
  WICKET = "wicket",
  MILESTONE = "milestone",
  PARTNERSHIP = "partnership",
  REVIEW = "review",
  POWER_PLAY = "power_play",
  CATCH = "catch",
  RUN_OUT = "run_out",
  STUMPING = "stumping",
  HAT_TRICK = "hat_trick",
  CENTURY = "century",
  FIFTY = "fifty",
  MAIDEN_OVER = "maiden_over",
  ECONOMY_OVER = "economy_over",
}

export enum TimelineEventType {
  TOSS = "toss",
  INNINGS_START = "innings_start",
  INNINGS_END = "innings_end",
  MATCH_END = "match_end",
  MILESTONE = "milestone",
  REVIEW = "review",
  BREAK = "break",
  RESUME = "resume",
  POWER_PLAY_START = "power_play_start",
  POWER_PLAY_END = "power_play_end",
  WICKET = "wicket",
  BOUNDARY = "boundary",
  PARTNERSHIP = "partnership",
  OVER_COMPLETE = "over_complete",
  DRINKS = "drinks",
  STRATEGIC_TIMEOUT = "strategic_timeout",
}

export class CreateHighlightDto {
  @ApiProperty({ description: "Highlight type", enum: HighlightType })
  @IsEnum(HighlightType)
  type: HighlightType;

  @ApiProperty({ description: "Highlight title" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Highlight description" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Ball number", required: false })
  @IsOptional()
  @IsNumber()
  ball?: number;

  @ApiProperty({ description: "Over number", required: false })
  @IsOptional()
  @IsNumber()
  over?: number;

  @ApiProperty({ description: "Innings number", required: false })
  @IsOptional()
  @IsNumber()
  innings?: number;

  @ApiProperty({
    description: "Players involved",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  players?: string[];

  @ApiProperty({
    description: "Teams involved",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teams?: string[];

  @ApiProperty({ description: "Video URL", required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ description: "Image URL", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: "Whether highlight is featured",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateHighlightDto {
  @ApiProperty({ description: "Highlight title", required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "Highlight description", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Video URL", required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ description: "Image URL", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: "Whether highlight is featured",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class CreateTimelineEventDto {
  @ApiProperty({ description: "Event type", enum: TimelineEventType })
  @IsEnum(TimelineEventType)
  type: TimelineEventType;

  @ApiProperty({ description: "Event title" })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({ description: "Event description" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Ball number", required: false })
  @IsOptional()
  @IsNumber()
  ball?: number;

  @ApiProperty({ description: "Over number", required: false })
  @IsOptional()
  @IsNumber()
  over?: number;

  @ApiProperty({ description: "Innings number", required: false })
  @IsOptional()
  @IsNumber()
  innings?: number;

  @ApiProperty({
    description: "Players involved",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  players?: string[];

  @ApiProperty({
    description: "Teams involved",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teams?: string[];

  @ApiProperty({ description: "Additional metadata", required: false })
  @IsOptional()
  metadata?: any;
}

export class HighlightFilterDto {
  @ApiProperty({ description: "Highlight type filter", required: false })
  @IsOptional()
  @IsEnum(HighlightType)
  type?: HighlightType;

  @ApiProperty({ description: "Innings filter", required: false })
  @IsOptional()
  @IsNumber()
  innings?: number;

  @ApiProperty({ description: "Player filter", required: false })
  @IsOptional()
  @IsMongoId()
  player?: string;

  @ApiProperty({ description: "Team filter", required: false })
  @IsOptional()
  @IsMongoId()
  team?: string;

  @ApiProperty({ description: "Featured highlights only", required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class TimelineFilterDto {
  @ApiProperty({ description: "Event type filter", required: false })
  @IsOptional()
  @IsEnum(TimelineEventType)
  type?: TimelineEventType;

  @ApiProperty({ description: "Innings filter", required: false })
  @IsOptional()
  @IsNumber()
  innings?: number;

  @ApiProperty({ description: "Player filter", required: false })
  @IsOptional()
  @IsMongoId()
  player?: string;

  @ApiProperty({ description: "Team filter", required: false })
  @IsOptional()
  @IsMongoId()
  team?: string;
}
