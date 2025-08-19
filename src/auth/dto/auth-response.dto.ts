import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class LogoutResponseDto {
  @ApiProperty()
  message: string;
} 