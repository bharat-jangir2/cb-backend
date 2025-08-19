import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: 'Team name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Team short name/abbreviation' })
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty({ description: 'Team logo URL', required: false })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({ description: 'Home venue', required: false })
  @IsOptional()
  @IsString()
  homeVenue?: string;

  @ApiProperty({ description: 'Team captain', required: false })
  @IsOptional()
  @IsString()
  captain?: string;

  @ApiProperty({ description: 'Team coach', required: false })
  @IsOptional()
  @IsString()
  coach?: string;

  @ApiProperty({ description: 'Year team was founded', required: false })
  @IsOptional()
  @IsNumber()
  foundedYear?: number;

  @ApiProperty({ description: 'Team description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
} 