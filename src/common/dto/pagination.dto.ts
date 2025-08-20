import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiProperty({ required: false, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ required: false, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiProperty({ required: false, description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by nationality' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false, description: 'Filter by role' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ required: false, description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: 'Filter by batting style' })
  @IsOptional()
  @IsString()
  battingStyle?: string;

  @ApiProperty({ required: false, description: 'Filter by bowling style' })
  @IsOptional()
  @IsString()
  bowlingStyle?: string;
}

export class PaginationResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
} 