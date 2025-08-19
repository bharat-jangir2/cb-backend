import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from "class-validator";

export enum RainRule {
  DLS = "DLS",
  VJD = "VJD",
  NONE = "none",
}

export class MatchSettingsDto {
  @ApiProperty({ description: "Whether DRS is available", required: false })
  @IsOptional()
  @IsBoolean()
  drsAvailable?: boolean;

  @ApiProperty({
    description: "Maximum DRS reviews per match",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxDRSReviews?: number;

  @ApiProperty({ description: "DRS reviews per innings", required: false })
  @IsOptional()
  @IsNumber()
  drsReviewsPerInnings?: number;

  @ApiProperty({
    description: "Whether super over is available",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  superOver?: boolean;

  @ApiProperty({
    description: "Whether reserve day is available",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  reserveDay?: boolean;

  @ApiProperty({
    description: "Rain rule to be used",
    enum: RainRule,
    required: false,
  })
  @IsOptional()
  @IsEnum(RainRule)
  rainRule?: RainRule;

  @ApiProperty({
    description: "Minimum overs required for result",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minimumOvers?: number;

  @ApiProperty({ description: "Power play overs", required: false })
  @IsOptional()
  @IsNumber()
  powerPlayOvers?: number;

  @ApiProperty({
    description: "Whether fielding restrictions apply",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  fieldingRestrictions?: boolean;
}

export class LiveStateDto {
  @ApiProperty({ description: "Whether match is live", required: false })
  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @ApiProperty({ description: "Stream URL", required: false })
  @IsOptional()
  @IsString()
  streamUrl?: string;

  @ApiProperty({ description: "Whether chat is enabled", required: false })
  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @ApiProperty({
    description: "Whether predictions are enabled",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  predictionsEnabled?: boolean;

  @ApiProperty({ description: "Whether fantasy is enabled", required: false })
  @IsOptional()
  @IsBoolean()
  fantasyEnabled?: boolean;
}

export class UpdateMatchSettingsDto {
  @ApiProperty({ description: "Match settings", required: false })
  @IsOptional()
  settings?: MatchSettingsDto;

  @ApiProperty({ description: "Live state", required: false })
  @IsOptional()
  liveState?: LiveStateDto;
}
