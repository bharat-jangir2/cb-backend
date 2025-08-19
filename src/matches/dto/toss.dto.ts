import { ApiProperty } from "@nestjs/swagger";
import {
  IsMongoId,
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
} from "class-validator";

export class TossDto {
  @ApiProperty({ description: "Toss winner team ID" })
  @IsMongoId()
  winner: string;

  @ApiProperty({ description: "Toss decision (bat/bowl)" })
  @IsString()
  decision: string;

  @ApiProperty({ description: "Toss timestamp", required: false })
  @IsOptional()
  @IsDate()
  timestamp?: Date;
}

export class NotificationDto {
  @ApiProperty({ description: "Notification type" })
  @IsString()
  type: string;

  @ApiProperty({ description: "Notification message" })
  @IsString()
  message: string;

  @ApiProperty({ description: "Notification timestamp", required: false })
  @IsOptional()
  @IsDate()
  timestamp?: Date;

  @ApiProperty({
    description: "Whether notification was sent",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sent?: boolean;
}

export class UpdateTossDto {
  @ApiProperty({ description: "Toss winner team ID", required: false })
  @IsOptional()
  @IsMongoId()
  winner?: string;

  @ApiProperty({ description: "Toss decision (bat/bowl)", required: false })
  @IsOptional()
  @IsString()
  decision?: string;

  @ApiProperty({ description: "Whether toss is completed", required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: "Whether notification was sent",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notified?: boolean;
}
