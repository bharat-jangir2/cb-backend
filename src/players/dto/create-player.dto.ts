import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum, IsUrl, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { PlayerRole } from '../../common/enums/player-role.enum';

export class CreatePlayerDto {
  @ApiProperty({ description: 'Player full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Player short name/nickname' })
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty({ description: 'Date of birth' })
  @Type(() => Date)
  @IsDate()
  dob: Date;

  @ApiProperty({ description: 'Player nationality' })
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({ description: 'Player role', enum: PlayerRole })
  @IsEnum(PlayerRole)
  role: PlayerRole;

  @ApiProperty({ description: 'Batting style', required: false })
  @IsOptional()
  @IsString()
  battingStyle?: string;

  @ApiProperty({ description: 'Bowling style', required: false })
  @IsOptional()
  @IsString()
  bowlingStyle?: string;

  @ApiProperty({ description: 'Career statistics', required: false })
  @IsOptional()
  @IsObject()
  careerStats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    catches?: number;
    stumpings?: number;
    fifties?: number;
    hundreds?: number;
    fiveWickets?: number;
    tenWickets?: number;
  };

  @ApiProperty({ description: 'Player photo URL', required: false })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiProperty({ description: 'Player status', required: false, default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Player height', required: false })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({ description: 'Player weight', required: false })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ description: 'Debut date', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  debutDate?: Date;
} 