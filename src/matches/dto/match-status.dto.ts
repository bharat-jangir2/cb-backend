import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsMongoId, IsString } from 'class-validator';
import { MatchStatus } from '../../common/enums/match-status.enum';

export class UpdateMatchStatusDto {
  @ApiProperty({ description: 'New match status', enum: MatchStatus })
  @IsEnum(MatchStatus)
  status: MatchStatus;

  @ApiProperty({ description: 'Toss winner team ID', required: false, type: String })
  @IsOptional()
  @IsMongoId()
  tossWinner?: string;

  @ApiProperty({ description: 'Toss decision', required: false, enum: ['bat', 'bowl'] })
  @IsOptional()
  @IsString()
  tossDecision?: 'bat' | 'bowl';

  @ApiProperty({ description: 'Current innings', required: false })
  @IsOptional()
  currentInnings?: number;

  @ApiProperty({ description: 'Current over', required: false })
  @IsOptional()
  currentOver?: number;

  @ApiProperty({ description: 'Current ball', required: false })
  @IsOptional()
  currentBall?: number;
} 