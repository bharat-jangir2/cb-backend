import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum, IsMongoId, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { MatchStatus } from '../../common/enums/match-status.enum';

export class CreateMatchDto {
  @ApiProperty({ description: 'Match name/title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Match venue' })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({ description: 'Match start time' })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({ description: 'Team A ID', type: String })
  @IsMongoId()
  teamAId: string;

  @ApiProperty({ description: 'Team B ID', type: String })
  @IsMongoId()
  teamBId: string;

  @ApiProperty({ description: 'Match type', required: false })
  @IsOptional()
  @IsString()
  matchType?: 'T20' | 'ODI' | 'Test';

  @ApiProperty({ description: 'Number of overs', required: false })
  @IsOptional()
  @IsNumber()
  overs?: number;

  @ApiProperty({ description: 'Umpires', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  umpires?: string[];

  @ApiProperty({ description: 'Third umpire', required: false })
  @IsOptional()
  @IsString()
  thirdUmpire?: string;

  @ApiProperty({ description: 'Match referee', required: false })
  @IsOptional()
  @IsString()
  matchReferee?: string;

  @ApiProperty({ description: 'Weather conditions', required: false })
  @IsOptional()
  @IsString()
  weather?: string;

  @ApiProperty({ description: 'Pitch condition', required: false })
  @IsOptional()
  @IsString()
  pitchCondition?: string;
} 