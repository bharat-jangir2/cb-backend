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
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { PlayersService } from "./players.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("players")
@Controller("api/players")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Create a new player" })
  @ApiResponse({
    status: 201,
    description: "Player successfully created",
  })
  @ApiResponse({
    status: 409,
    description: "Player with this name already exists",
  })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all players" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of items per page (default: 10, max: 100)" })
  @ApiQuery({ name: "sortBy", required: false, type: String, description: "Field to sort by (default: fullName)" })
  @ApiQuery({ name: "sortOrder", required: false, enum: ['asc', 'desc'], description: "Sort order (default: asc)" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Search term to filter players" })
  @ApiQuery({ name: "nationality", required: false, type: String, description: "Filter by nationality" })
  @ApiQuery({ name: "role", required: false, type: String, description: "Filter by role" })
  @ApiQuery({ name: "status", required: false, type: String, description: "Filter by status" })
  @ApiQuery({ name: "battingStyle", required: false, type: String, description: "Filter by batting style" })
  @ApiQuery({ name: "bowlingStyle", required: false, type: String, description: "Filter by bowling style" })
  @ApiResponse({
    status: 200,
    description: "Players retrieved successfully",
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.playersService.findAll(paginationQuery);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get player by ID" })
  @ApiParam({ name: "id", description: "Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Player not found" })
  findOne(@Param("id") id: string) {
    return this.playersService.findById(id);
  }

  @Get("role/:role")
  @ApiOperation({ summary: "Get players by role" })
  @ApiParam({ name: "role", description: "Player role" })
  @ApiResponse({
    status: 200,
    description: "Players retrieved successfully",
  })
  findByRole(@Param("role") role: string) {
    return this.playersService.findByRole(role);
  }

  @Get("nationality/:nationality")
  @ApiOperation({ summary: "Get players by nationality" })
  @ApiParam({ name: "nationality", description: "Player nationality" })
  @ApiResponse({
    status: 200,
    description: "Players retrieved successfully",
  })
  findByNationality(@Param("nationality") nationality: string) {
    return this.playersService.findByNationality(nationality);
  }

  @Get("team/:teamId")
  @ApiOperation({ summary: "Get players by team ID" })
  @ApiParam({ name: "teamId", description: "Team ID" })
  @ApiResponse({
    status: 200,
    description: "Players retrieved successfully",
  })
  findByTeam(@Param("teamId") teamId: string) {
    return this.playersService.findByTeam(teamId);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update player (partial)" })
  @ApiParam({ name: "id", description: "Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player updated successfully",
  })
  @ApiResponse({ status: 404, description: "Player not found" })
  @ApiResponse({
    status: 409,
    description: "Player with this name already exists",
  })
  update(@Param("id") id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update player (full)" })
  @ApiParam({ name: "id", description: "Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player updated successfully",
  })
  @ApiResponse({ status: 404, description: "Player not found" })
  @ApiResponse({
    status: 409,
    description: "Player with this name already exists",
  })
  updateFull(@Param("id") id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete player (Admin only)" })
  @ApiParam({ name: "id", description: "Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Player not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  remove(@Param("id") id: string) {
    return this.playersService.remove(id);
  }
}
