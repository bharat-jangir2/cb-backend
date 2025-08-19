import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsOptional, IsDate } from "class-validator";

export class StrikeRotationDto {
  @ApiProperty({ description: "Striker player ID" })
  @IsMongoId()
  striker: string;

  @ApiProperty({ description: "Non-striker player ID" })
  @IsMongoId()
  nonStriker: string;

  @ApiProperty({ description: "Bowler player ID" })
  @IsMongoId()
  bowler: string;

  @ApiProperty({ description: "Last updated timestamp", required: false })
  @IsOptional()
  @IsDate()
  lastUpdated?: Date;
}

export class UpdateStrikeRotationDto {
  @ApiProperty({ description: "Striker player ID", required: false })
  @IsOptional()
  @IsMongoId()
  striker?: string;

  @ApiProperty({ description: "Non-striker player ID", required: false })
  @IsOptional()
  @IsMongoId()
  nonStriker?: string;

  @ApiProperty({ description: "Bowler player ID", required: false })
  @IsOptional()
  @IsMongoId()
  bowler?: string;
}
