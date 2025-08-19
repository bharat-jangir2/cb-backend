import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsMongoId, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ExtraDto {
  @ApiProperty({ description: 'Type of extra', enum: ['wide', 'no_ball', 'bye', 'leg_bye'] })
  @IsString()
  type: 'wide' | 'no_ball' | 'bye' | 'leg_bye';

  @ApiProperty({ description: 'Runs from extra' })
  @IsNumber()
  runs: number;

  @ApiProperty({ description: 'Description of extra', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class WicketDto {
  @ApiProperty({ description: 'Type of wicket', enum: ['bowled', 'caught', 'lbw', 'run_out', 'stumped', 'hit_wicket', 'obstructing', 'handled_ball', 'timed_out', 'retired_out'] })
  @IsString()
  type: 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'obstructing' | 'handled_ball' | 'timed_out' | 'retired_out';

  @ApiProperty({ description: 'Batsman ID', type: String })
  @IsMongoId()
  batsman: string;

  @ApiProperty({ description: 'Bowler ID', required: false, type: String })
  @IsOptional()
  @IsMongoId()
  bowler?: string;

  @ApiProperty({ description: 'Caught by player ID', required: false, type: String })
  @IsOptional()
  @IsMongoId()
  caughtBy?: string;

  @ApiProperty({ description: 'Run out by player ID', required: false, type: String })
  @IsOptional()
  @IsMongoId()
  runOutBy?: string;

  @ApiProperty({ description: 'Stumped by player ID', required: false, type: String })
  @IsOptional()
  @IsMongoId()
  stumpedBy?: string;

  @ApiProperty({ description: 'Description of wicket', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class OverChangeDto {
  @ApiProperty({ description: 'New bowler ID', type: String })
  @IsMongoId()
  newBowler: string;

  @ApiProperty({ description: 'Reason for change', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

class InningsChangeDto {
  @ApiProperty({ description: 'Reason for innings change', enum: ['all_out', 'target_reached', 'overs_completed', 'declaration'] })
  @IsString()
  reason: 'all_out' | 'target_reached' | 'overs_completed' | 'declaration';

  @ApiProperty({ description: 'Description of change', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBallDto {
  @ApiProperty({ description: 'Innings number' })
  @IsNumber()
  innings: number;

  @ApiProperty({ description: 'Over number' })
  @IsNumber()
  over: number;

  @ApiProperty({ description: 'Ball number within the over' })
  @IsNumber()
  ball: number;

  @ApiProperty({ description: 'Ball event type', enum: ['runs', 'wicket', 'extra', 'over_change', 'innings_change'] })
  @IsString()
  eventType: 'runs' | 'wicket' | 'extra' | 'over_change' | 'innings_change';

  @ApiProperty({ description: 'Runs scored', required: false })
  @IsOptional()
  @IsNumber()
  runs?: number;

  @ApiProperty({ description: 'Extra details', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExtraDto)
  extras?: ExtraDto;

  @ApiProperty({ description: 'Wicket details', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => WicketDto)
  wicket?: WicketDto;

  @ApiProperty({ description: 'Over change details', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OverChangeDto)
  overChange?: OverChangeDto;

  @ApiProperty({ description: 'Innings change details', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => InningsChangeDto)
  inningsChange?: InningsChangeDto;

  @ApiProperty({ description: 'General description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Commentary', required: false })
  @IsOptional()
  @IsString()
  commentary?: string;
} 