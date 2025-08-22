import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const { passwordHash, ...result } = userObj;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: {
        id: (user as any)._id || (user as any).id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(
      registerDto.username
    );
    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const existingEmail = await this.usersService.findByEmail(
      registerDto.email
    );
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    // Create new user
    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: (user as any)._id || (user as any).id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const tokens = await this.generateTokens(user);
      return {
        ...tokens,
        user: {
          id: (user as any)._id || (user as any).id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: "Successfully logged out" };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const userObj = (user as any).toObject ? (user as any).toObject() : user;
    const { passwordHash, ...result } = userObj;

    return {
      id: result._id || result.id,
      username: result.username,
      email: result.email,
      role: result.role,
      isActive: result.isActive,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  private async generateTokens(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>("JWT_EXPIRES_IN", "24h"),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>(
          "JWT_REFRESH_EXPIRES_IN",
          "7d"
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
