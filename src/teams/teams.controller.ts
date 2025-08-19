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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("teams")
@Controller("api/teams")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Create a new team" })
  @ApiResponse({
    status: 201,
    description: "Team successfully created",
  })
  @ApiResponse({
    status: 409,
    description: "Team name or short name already exists",
  })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all teams" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Teams retrieved successfully",
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.teamsService.findAll(paginationQuery);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get team by ID" })
  @ApiParam({ name: "id", description: "Team ID" })
  @ApiResponse({
    status: 200,
    description: "Team retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Team not found" })
  findOne(@Param("id") id: string) {
    return this.teamsService.findById(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update team" })
  @ApiParam({ name: "id", description: "Team ID" })
  @ApiResponse({
    status: 200,
    description: "Team updated successfully",
  })
  @ApiResponse({ status: 404, description: "Team not found" })
  @ApiResponse({
    status: 409,
    description: "Team name or short name already exists",
  })
  update(@Param("id") id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete team (Admin only)" })
  @ApiParam({ name: "id", description: "Team ID" })
  @ApiResponse({
    status: 200,
    description: "Team deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Team not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  remove(@Param("id") id: string) {
    return this.teamsService.remove(id);
  }
}
