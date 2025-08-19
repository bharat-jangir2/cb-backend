import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export enum BallEventType {
  RUNS = "runs",
  WICKET = "wicket",
  EXTRA = "extra",
  OVER_CHANGE = "over_change",
  INNINGS_CHANGE = "innings_change",
}

export enum ExtraType {
  WIDE = "wide",
  NO_BALL = "no_ball",
  BYE = "bye",
  LEG_BYE = "leg_bye",
}

export enum WicketType {
  BOWLED = "bowled",
  CAUGHT = "caught",
  LBW = "lbw",
  RUN_OUT = "run_out",
  STUMPED = "stumped",
  HIT_WICKET = "hit_wicket",
  OBSTRUCTING = "obstructing",
  HANDLED_BALL = "handled_ball",
  TIMED_OUT = "timed_out",
  RETIRED_OUT = "retired_out",
}

export class ExtraDto {
  @ApiProperty({ description: "Type of extra", enum: ExtraType })
  @IsEnum(ExtraType)
  type: ExtraType;

  @ApiProperty({ description: "Runs from extra" })
  @IsNumber()
  runs: number;

  @ApiProperty({ description: "Description of extra", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class WicketDto {
  @ApiProperty({ description: "Type of wicket", enum: WicketType })
  @IsEnum(WicketType)
  type: WicketType;

  @ApiProperty({ description: "Batsman who got out", type: String })
  @IsMongoId()
  batsman: string;

  @ApiProperty({
    description: "Bowler who took wicket",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  bowler?: string;

  @ApiProperty({
    description: "Player who caught the ball",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  caughtBy?: string;

  @ApiProperty({
    description: "Player who effected run out",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  runOutBy?: string;

  @ApiProperty({
    description: "Player who effected stumping",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  stumpedBy?: string;

  @ApiProperty({ description: "Description of wicket", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBallByBallDto {
  @ApiProperty({ description: "Ball number" })
  @IsNumber()
  ball: number;

  @ApiProperty({ description: "Over number" })
  @IsNumber()
  over: number;

  @ApiProperty({ description: "Innings number" })
  @IsNumber()
  innings: number;

  @ApiProperty({ description: "Event type", enum: BallEventType })
  @IsEnum(BallEventType)
  eventType: BallEventType;

  @ApiProperty({ description: "Runs scored", required: false })
  @IsOptional()
  @IsNumber()
  runs?: number;

  @ApiProperty({ description: "Extra details", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExtraDto)
  extras?: ExtraDto;

  @ApiProperty({ description: "Wicket details", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => WicketDto)
  wicket?: WicketDto;

  @ApiProperty({ description: "Striker player ID", type: String })
  @IsMongoId()
  striker: string;

  @ApiProperty({ description: "Non-striker player ID", type: String })
  @IsMongoId()
  nonStriker: string;

  @ApiProperty({ description: "Bowler player ID", type: String })
  @IsMongoId()
  bowler: string;

  @ApiProperty({ description: "Ball commentary", required: false })
  @IsOptional()
  @IsString()
  commentary?: string;

  @ApiProperty({ description: "Whether ball was reviewed", required: false })
  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;

  @ApiProperty({ description: "Review result", required: false })
  @IsOptional()
  @IsString()
  reviewResult?: string;
}

export class UpdateBallByBallDto {
  @ApiProperty({ description: "Ball commentary", required: false })
  @IsOptional()
  @IsString()
  commentary?: string;

  @ApiProperty({ description: "Whether ball was reviewed", required: false })
  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;

  @ApiProperty({ description: "Review result", required: false })
  @IsOptional()
  @IsString()
  reviewResult?: string;
}

export class BallByBallFilterDto {
  @ApiProperty({ description: "Over number filter", required: false })
  @IsOptional()
  @IsNumber()
  over?: number;

  @ApiProperty({ description: "Innings number filter", required: false })
  @IsOptional()
  @IsNumber()
  innings?: number;

  @ApiProperty({ description: "Event type filter", required: false })
  @IsOptional()
  @IsEnum(BallEventType)
  eventType?: BallEventType;

  @ApiProperty({ description: "Player ID filter", required: false })
  @IsOptional()
  @IsMongoId()
  player?: string;
}
