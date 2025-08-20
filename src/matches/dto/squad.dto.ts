import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsMongoId,
  IsOptional,
  ValidateNested,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class TeamPlayingXIDto {
  @ApiProperty({ description: "Playing XI player IDs" })
  @IsArray()
  @IsMongoId({ each: true })
  players: string[];

  @ApiProperty({ description: "Team captain ID" })
  @IsMongoId()
  captain: string;

  @ApiProperty({ description: "Team vice-captain ID" })
  @IsMongoId()
  viceCaptain: string;

  @ApiProperty({ description: "Batting order (array of player IDs)" })
  @IsArray()
  @IsMongoId({ each: true })
  battingOrder: string[];

  @ApiProperty({ description: "Wicket-keeper ID" })
  @IsMongoId()
  wicketKeeper: string;
}

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
  @ApiProperty({ description: "Team A playing XI details" })
  @ValidateNested()
  @Type(() => TeamPlayingXIDto)
  teamA: TeamPlayingXIDto;

  @ApiProperty({ description: "Team B playing XI details" })
  @ValidateNested()
  @Type(() => TeamPlayingXIDto)
  teamB: TeamPlayingXIDto;
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
  @ApiProperty({ description: "Team A playing XI details", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamPlayingXIDto)
  teamA?: TeamPlayingXIDto;

  @ApiProperty({ description: "Team B playing XI details", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamPlayingXIDto)
  teamB?: TeamPlayingXIDto;
}

// Additional DTOs for specific operations
export class UpdateCaptainDto {
  @ApiProperty({ description: "Team (A or B)" })
  @IsString()
  team: "A" | "B";

  @ApiProperty({ description: "Captain player ID" })
  @IsMongoId()
  captainId: string;
}

export class UpdateViceCaptainDto {
  @ApiProperty({ description: "Team (A or B)" })
  @IsString()
  team: "A" | "B";

  @ApiProperty({ description: "Vice-captain player ID" })
  @IsMongoId()
  viceCaptainId: string;
}

export class UpdateBattingOrderDto {
  @ApiProperty({ description: "Team (A or B)" })
  @IsString()
  team: "A" | "B";

  @ApiProperty({ description: "Batting order (array of player IDs)" })
  @IsArray()
  @IsMongoId({ each: true })
  battingOrder: string[];
}

export class UpdateWicketKeeperDto {
  @ApiProperty({ description: "Team (A or B)" })
  @IsString()
  team: "A" | "B";

  @ApiProperty({ description: "Wicket-keeper player ID" })
  @IsMongoId()
  wicketKeeperId: string;
}
