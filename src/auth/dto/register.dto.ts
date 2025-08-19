import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole, default: UserRole.VIEWER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.VIEWER;
} 