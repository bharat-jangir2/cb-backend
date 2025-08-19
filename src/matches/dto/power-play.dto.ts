import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsMongoId,
} from "class-validator";

export enum PowerPlayType {
  MANDATORY = "mandatory",
  BATTING = "batting",
  BOWLING = "bowling",
}

export enum PowerPlayStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export class CreatePowerPlayDto {
  @ApiProperty({ description: "Power play type", enum: PowerPlayType })
  @IsEnum(PowerPlayType)
  type: PowerPlayType;

  @ApiProperty({ description: "Power play status", enum: PowerPlayStatus })
  @IsEnum(PowerPlayStatus)
  status: PowerPlayStatus;

  @ApiProperty({ description: "Starting over number" })
  @IsNumber()
  startOver: number;

  @ApiProperty({ description: "Ending over number" })
  @IsNumber()
  endOver: number;

  @ApiProperty({ description: "Innings number (1 or 2)" })
  @IsNumber()
  innings: number;

  @ApiProperty({
    description: "Maximum fielders allowed outside 30-yard circle",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxFieldersOutside?: number;

  @ApiProperty({
    description: "Description of the power play",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Whether this is a mandatory power play",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;
}

export class UpdatePowerPlayDto {
  @ApiProperty({
    description: "Power play status",
    enum: PowerPlayStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PowerPlayStatus)
  status?: PowerPlayStatus;

  @ApiProperty({ description: "Current over number", required: false })
  @IsOptional()
  @IsNumber()
  currentOver?: number;

  @ApiProperty({
    description: "Whether power play is currently active",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: "Power play completion time", required: false })
  @IsOptional()
  @IsString()
  completedAt?: string;

  @ApiProperty({ description: "Notes about the power play", required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PowerPlayStatsDto {
  @ApiProperty({ description: "Runs scored during power play" })
  @IsNumber()
  runsScored: number;

  @ApiProperty({ description: "Wickets lost during power play" })
  @IsNumber()
  wicketsLost: number;

  @ApiProperty({ description: "Overs completed in power play" })
  @IsNumber()
  oversCompleted: number;

  @ApiProperty({ description: "Run rate during power play" })
  @IsNumber()
  runRate: number;

  @ApiProperty({ description: "Boundaries hit during power play" })
  @IsNumber()
  boundaries: number;

  @ApiProperty({ description: "Sixes hit during power play" })
  @IsNumber()
  sixes: number;
}
