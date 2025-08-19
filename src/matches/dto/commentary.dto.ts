import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, IsDate } from "class-validator";

export class CommentaryDto {
  @ApiProperty({ description: "Ball number" })
  @IsNumber()
  ball: number;

  @ApiProperty({ description: "Over number" })
  @IsNumber()
  over: number;

  @ApiProperty({ description: "Innings number" })
  @IsNumber()
  innings: number;

  @ApiProperty({ description: "Commentary text" })
  @IsString()
  commentary: string;

  @ApiProperty({ description: "Commentator name", required: false })
  @IsOptional()
  @IsString()
  commentator?: string;

  @ApiProperty({ description: "Timestamp", required: false })
  @IsOptional()
  @IsDate()
  timestamp?: Date;
}

export class UpdateCommentaryDto {
  @ApiProperty({ description: "Commentary text", required: false })
  @IsOptional()
  @IsString()
  commentary?: string;

  @ApiProperty({ description: "Commentator name", required: false })
  @IsOptional()
  @IsString()
  commentator?: string;
}
