import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("users")
@Controller("api/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new user (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "User successfully created",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  @ApiResponse({ status: 409, description: "Username or email already exists" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get all users (Admin/Scorer only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Users retrieved successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.usersService.findAll(paginationQuery);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get user by ID (Admin/Scorer only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Get("profile/me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Profile retrieved successfully",
  })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get("check-username/:username")
  @ApiOperation({ summary: "Check if username is available" })
  @ApiParam({ name: "username", description: "Username to check" })
  @ApiResponse({
    status: 200,
    description: "Username availability checked",
    schema: {
      type: "object",
      properties: {
        available: { type: "boolean" },
        message: { type: "string" },
      },
    },
  })
  async checkUsername(@Param("username") username: string) {
    const existingUser = await this.usersService.findByUsername(username);
    return {
      available: !existingUser,
      message: existingUser ? "Username already taken" : "Username available",
    };
  }

  @Get("check-email/:email")
  @ApiOperation({ summary: "Check if email is available" })
  @ApiParam({ name: "email", description: "Email to check" })
  @ApiResponse({
    status: 200,
    description: "Email availability checked",
    schema: {
      type: "object",
      properties: {
        available: { type: "boolean" },
        message: { type: "string" },
      },
    },
  })
  async checkEmail(@Param("email") email: string) {
    const existingUser = await this.usersService.findByEmail(email);
    return {
      available: !existingUser,
      message: existingUser ? "Email already registered" : "Email available",
    };
  }
}
