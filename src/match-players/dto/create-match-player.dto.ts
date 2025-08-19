import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsNumber, IsBoolean } from 'class-validator';

export class CreateMatchPlayerDto {
  @ApiProperty({ description: 'Player ID', type: String })
  @IsMongoId()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({ description: 'Team ID', type: String })
  @IsMongoId()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({ description: 'Role in match' })
  @IsString()
  @IsNotEmpty()
  roleInMatch: string;

  @ApiProperty({ description: 'Batting order', required: false })
  @IsOptional()
  @IsNumber()
  battingOrder?: number;

  @ApiProperty({ description: 'Bowling order', required: false })
  @IsOptional()
  @IsNumber()
  bowlingOrder?: number;

  @ApiProperty({ description: 'Is captain', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCaptain?: boolean;

  @ApiProperty({ description: 'Is vice captain', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isViceCaptain?: boolean;

  @ApiProperty({ description: 'Jersey number', required: false })
  @IsOptional()
  @IsNumber()
  jerseyNumber?: number;
} 