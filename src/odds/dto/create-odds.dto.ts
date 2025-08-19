import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsMongoId, IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TeamOddsDto {
  @ApiProperty({ description: 'Odds for the team' })
  @IsNumber()
  odds: number;

  @ApiProperty({ description: 'Probability of winning (0-1)' })
  @IsNumber()
  probability: number;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class LiveScoreDto {
  @ApiProperty({ description: 'Team A runs' })
  @IsNumber()
  teamARuns: number;

  @ApiProperty({ description: 'Team A wickets' })
  @IsNumber()
  teamAWickets: number;

  @ApiProperty({ description: 'Team A overs' })
  @IsNumber()
  teamAOvers: number;

  @ApiProperty({ description: 'Team B runs' })
  @IsNumber()
  teamBRuns: number;

  @ApiProperty({ description: 'Team B wickets' })
  @IsNumber()
  teamBWickets: number;

  @ApiProperty({ description: 'Team B overs' })
  @IsNumber()
  teamBOvers: number;
}

class LiveOddsDto {
  @ApiProperty({ description: 'Current score' })
  @ValidateNested()
  @Type(() => LiveScoreDto)
  currentScore: LiveScoreDto;

  @ApiProperty({ description: 'Required run rate', required: false })
  @IsOptional()
  @IsNumber()
  requiredRunRate?: number;

  @ApiProperty({ description: 'Current run rate', required: false })
  @IsOptional()
  @IsNumber()
  currentRunRate?: number;

  @ApiProperty({ description: 'Overs remaining', required: false })
  @IsOptional()
  @IsNumber()
  oversRemaining?: number;

  @ApiProperty({ description: 'Wickets remaining', required: false })
  @IsOptional()
  @IsNumber()
  wicketsRemaining?: number;
}

export class CreateOddsDto {
  @ApiProperty({ description: 'Team A odds' })
  @ValidateNested()
  @Type(() => TeamOddsDto)
  teamA: TeamOddsDto;

  @ApiProperty({ description: 'Team B odds' })
  @ValidateNested()
  @Type(() => TeamOddsDto)
  teamB: TeamOddsDto;

  @ApiProperty({ description: 'Draw odds', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamOddsDto)
  draw?: TeamOddsDto;

  @ApiProperty({ description: 'Tie odds', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamOddsDto)
  tie?: TeamOddsDto;

  @ApiProperty({ description: 'Live match data', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LiveOddsDto)
  live?: LiveOddsDto;

  @ApiProperty({ description: 'Source of odds', enum: ['manual', 'ai_agent', 'bookmaker'] })
  @IsString()
  source: 'manual' | 'ai_agent' | 'bookmaker';

  @ApiProperty({ description: 'Confidence level (0-1)', required: false })
  @IsOptional()
  @IsNumber()
  confidence?: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
} 