import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsOptional } from "class-validator";

export class SquadDto {
  @ApiProperty({ description: "Team A squad player IDs" })
  @IsArray()
  @IsMongoId({ each: true })
  teamA: string[];

  @ApiProperty({ description: "Team B squad player IDs" })
  @IsArray()
  @IsMongoId({ each: true })
  teamB: string[];
}

export class PlayingXIDto {
  @ApiProperty({ description: "Team A playing XI player IDs" })
  @IsArray()
  @IsMongoId({ each: true })
  teamA: string[];

  @ApiProperty({ description: "Team B playing XI player IDs" })
  @IsArray()
  @IsMongoId({ each: true })
  teamB: string[];
}

export class UpdateSquadDto {
  @ApiProperty({ description: "Team A squad player IDs", required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teamA?: string[];

  @ApiProperty({ description: "Team B squad player IDs", required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teamB?: string[];
}

export class UpdatePlayingXIDto {
  @ApiProperty({ description: "Team A playing XI player IDs", required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teamA?: string[];

  @ApiProperty({ description: "Team B playing XI player IDs", required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teamB?: string[];
}
