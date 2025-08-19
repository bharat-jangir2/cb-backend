import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsDate,
} from "class-validator";

export class CreateNewsDto {
  @ApiProperty({ description: "News title" })
  @IsString()
  title: string;

  @ApiProperty({ description: "News content" })
  @IsString()
  content: string;

  @ApiProperty({ description: "News summary", required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: "Author name" })
  @IsString()
  author: string;

  @ApiProperty({ description: "News category" })
  @IsString()
  category: string;

  @ApiProperty({ description: "Tags", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: "Image URL", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: "Is published", required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ description: "Is featured", required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ description: "Related match ID", required: false })
  @IsOptional()
  @IsMongoId()
  relatedMatch?: string;

  @ApiProperty({ description: "Related player ID", required: false })
  @IsOptional()
  @IsMongoId()
  relatedPlayer?: string;

  @ApiProperty({ description: "Related team ID", required: false })
  @IsOptional()
  @IsMongoId()
  relatedTeam?: string;

  @ApiProperty({ description: "SEO title", required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ description: "SEO description", required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ description: "SEO keywords", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];
}

export class UpdateNewsDto {
  @ApiProperty({ description: "News title", required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "News content", required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: "News summary", required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: "Author name", required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: "News category", required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: "Tags", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: "Image URL", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: "Is published", required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ description: "Is featured", required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ description: "Related match ID", required: false })
  @IsOptional()
  @IsMongoId()
  relatedMatch?: string;

  @ApiProperty({ description: "Related player ID", required: false })
  @IsOptional()
  @IsMongoId()
  relatedPlayer?: string;

  @ApiProperty({ description: "Related team ID", required: false })
  @IsOptional()
  @IsMongoId()
  relatedTeam?: string;

  @ApiProperty({ description: "SEO title", required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ description: "SEO description", required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ description: "SEO keywords", type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];
}
