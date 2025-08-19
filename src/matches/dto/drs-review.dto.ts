import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsMongoId,
} from "class-validator";

export enum DRSReviewType {
  LBW = "lbw",
  CAUGHT = "caught",
  STUMPED = "stumped",
  RUN_OUT = "run_out",
}

export enum DRSDecision {
  UPHELD = "upheld",
  STRUCK_DOWN = "struck_down",
  UMPIRES_CALL = "umpires_call",
}

export enum OriginalDecision {
  OUT = "out",
  NOT_OUT = "not_out",
}

export class CreateDRSReviewDto {
  @ApiProperty({ description: "Ball number" })
  @IsNumber()
  ball: number;

  @ApiProperty({ description: "Over number" })
  @IsNumber()
  over: number;

  @ApiProperty({ description: "Innings number" })
  @IsNumber()
  innings: number;

  @ApiProperty({ description: "Type of review", enum: DRSReviewType })
  @IsEnum(DRSReviewType)
  reviewType: DRSReviewType;

  @ApiProperty({ description: "Team requesting review", type: String })
  @IsMongoId()
  requestingTeam: string;

  @ApiProperty({ description: "Player requesting review", type: String })
  @IsMongoId()
  requestingPlayer: string;

  @ApiProperty({ description: "Player being reviewed", type: String })
  @IsMongoId()
  reviewedPlayer: string;

  @ApiProperty({ description: "Original decision", enum: OriginalDecision })
  @IsEnum(OriginalDecision)
  originalDecision: OriginalDecision;

  @ApiProperty({ description: "Reason for review", required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateDRSReviewDto {
  @ApiProperty({
    description: "Final decision",
    enum: DRSDecision,
    required: false,
  })
  @IsOptional()
  @IsEnum(DRSDecision)
  finalDecision?: DRSDecision;

  @ApiProperty({ description: "Reason for decision", required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: "Time taken for review in seconds",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  reviewTime?: number;
}

export class DRSReviewFilterDto {
  @ApiProperty({ description: "Review type filter", required: false })
  @IsOptional()
  @IsEnum(DRSReviewType)
  reviewType?: DRSReviewType;

  @ApiProperty({ description: "Team filter", required: false })
  @IsOptional()
  @IsMongoId()
  team?: string;

  @ApiProperty({ description: "Player filter", required: false })
  @IsOptional()
  @IsMongoId()
  player?: string;

  @ApiProperty({ description: "Final decision filter", required: false })
  @IsOptional()
  @IsEnum(DRSDecision)
  finalDecision?: DRSDecision;
}
