import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsObject } from "class-validator";
import { CreateMatchDto } from "./create-match.dto";

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @ApiProperty({ description: "Current innings", required: false })
  @IsOptional()
  @IsNumber()
  currentInnings?: number;

  @ApiProperty({ description: "Current over", required: false })
  @IsOptional()
  @IsNumber()
  currentOver?: number;

  @ApiProperty({ description: "Current ball", required: false })
  @IsOptional()
  @IsNumber()
  currentBall?: number;

  @ApiProperty({ description: "Match score", required: false })
  @IsOptional()
  @IsObject()
  score?: {
    teamA: { runs: number; wickets: number; overs: number };
    teamB: { runs: number; wickets: number; overs: number };
  };
}
