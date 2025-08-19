import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsMongoId,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export enum FieldingPosition {
  SLIP = "slip",
  GULLY = "gully",
  POINT = "point",
  COVER = "cover",
  MID_OFF = "mid_off",
  MID_ON = "mid_on",
  MID_WICKET = "mid_wicket",
  SQUARE_LEG = "square_leg",
  FINE_LEG = "fine_leg",
  THIRD_MAN = "third_man",
  LONG_OFF = "long_off",
  LONG_ON = "long_on",
  DEEP_MID_WICKET = "deep_mid_wicket",
  DEEP_SQUARE_LEG = "deep_square_leg",
  DEEP_POINT = "deep_point",
  DEEP_COVER = "deep_cover",
  SILLY_POINT = "silly_point",
  SILLY_MID_OFF = "silly_mid_off",
  SILLY_MID_ON = "silly_mid_on",
  SHORT_LEG = "short_leg",
  LEG_SLIP = "leg_slip",
  WICKET_KEEPER = "wicket_keeper",
  BOWLER = "bowler",
  SHORT_MID_WICKET = "short_mid_wicket",
  SHORT_COVER = "short_cover",
  EXTRA_COVER = "extra_cover",
  SWEEP_COVER = "sweep_cover",
  SWEEP_POINT = "sweep_point",
  SWEEP_SQUARE_LEG = "sweep_square_leg",
  SWEEP_MID_WICKET = "sweep_mid_wicket",
  SWEEP_FINE_LEG = "sweep_fine_leg",
  SWEEP_THIRD_MAN = "sweep_third_man",
  SWEEP_LONG_OFF = "sweep_long_off",
  SWEEP_LONG_ON = "sweep_long_on",
}

export class FieldingPositionDto {
  @ApiProperty({ description: "Player ID", type: String })
  @IsMongoId()
  player: string;

  @ApiProperty({ description: "Fielding position", enum: FieldingPosition })
  @IsEnum(FieldingPosition)
  position: FieldingPosition;

  @ApiProperty({ description: "X coordinate on field", required: false })
  @IsOptional()
  @IsNumber()
  x?: number;

  @ApiProperty({ description: "Y coordinate on field", required: false })
  @IsOptional()
  @IsNumber()
  y?: number;
}

export class CreateFieldingPositionsDto {
  @ApiProperty({ description: "Ball number" })
  @IsNumber()
  ball: number;

  @ApiProperty({ description: "Over number" })
  @IsNumber()
  over: number;

  @ApiProperty({ description: "Innings number" })
  @IsNumber()
  innings: number;

  @ApiProperty({
    description: "Fielding positions",
    type: [FieldingPositionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldingPositionDto)
  positions: FieldingPositionDto[];
}

export class UpdateFieldingPositionsDto {
  @ApiProperty({
    description: "Fielding positions",
    type: [FieldingPositionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldingPositionDto)
  positions?: FieldingPositionDto[];
}

export class FieldingPositionsFilterDto {
  @ApiProperty({ description: "Over number filter", required: false })
  @IsOptional()
  @IsNumber()
  over?: number;

  @ApiProperty({ description: "Innings filter", required: false })
  @IsOptional()
  @IsNumber()
  innings?: number;

  @ApiProperty({ description: "Player filter", required: false })
  @IsOptional()
  @IsMongoId()
  player?: string;

  @ApiProperty({ description: "Position filter", required: false })
  @IsOptional()
  @IsEnum(FieldingPosition)
  position?: FieldingPosition;
}
