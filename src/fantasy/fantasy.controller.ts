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
  ApiQuery,
} from "@nestjs/swagger";
import { FantasyService } from "./fantasy.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("fantasy")
@Controller("api/fantasy")
export class FantasyController {
  constructor(private readonly fantasyService: FantasyService) {}

  // Fantasy Leagues
  @Post("leagues")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create fantasy league" })
  @ApiResponse({
    status: 201,
    description: "Fantasy league created successfully",
  })
  createLeague(@Body() createLeagueDto: any) {
    return this.fantasyService.createLeague(createLeagueDto);
  }

  @Get("leagues")
  @ApiOperation({ summary: "Get all fantasy leagues" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Fantasy leagues retrieved successfully",
  })
  findAllLeagues(
    @Query()
    query: PaginationQueryDto & {
      status?: string;
      type?: string;
    }
  ) {
    return this.fantasyService.findAllLeagues(query);
  }

  @Get("leagues/:id")
  @ApiOperation({ summary: "Get fantasy league by ID" })
  @ApiResponse({
    status: 200,
    description: "Fantasy league retrieved successfully",
  })
  findLeagueById(@Param("id") id: string) {
    return this.fantasyService.findLeagueById(id);
  }

  @Post("leagues/:id/join")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Join fantasy league" })
  @ApiResponse({
    status: 200,
    description: "Joined fantasy league successfully",
  })
  joinLeague(@Param("id") id: string, @Body() joinDto: any) {
    return this.fantasyService.joinLeague(id, joinDto);
  }

  @Get("leagues/:id/leaderboard")
  @ApiOperation({ summary: "Get fantasy league leaderboard" })
  @ApiResponse({
    status: 200,
    description: "Leaderboard retrieved successfully",
  })
  getLeaderboard(@Param("id") id: string) {
    return this.fantasyService.getLeaderboard(id);
  }

  @Patch("leagues/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update fantasy league" })
  @ApiResponse({
    status: 200,
    description: "Fantasy league updated successfully",
  })
  updateLeague(@Param("id") id: string, @Body() updateLeagueDto: any) {
    return this.fantasyService.updateLeague(id, updateLeagueDto);
  }

  @Delete("leagues/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete fantasy league" })
  @ApiResponse({
    status: 200,
    description: "Fantasy league deleted successfully",
  })
  removeLeague(@Param("id") id: string) {
    return this.fantasyService.removeLeague(id);
  }

  // Fantasy Teams
  @Post("teams")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create fantasy team" })
  @ApiResponse({
    status: 201,
    description: "Fantasy team created successfully",
  })
  createTeam(@Body() createTeamDto: any) {
    return this.fantasyService.createTeam(createTeamDto);
  }

  @Get("teams")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user fantasy teams" })
  @ApiResponse({
    status: 200,
    description: "Fantasy teams retrieved successfully",
  })
  findUserTeams(@Query() query: PaginationQueryDto & { leagueId?: string }) {
    return this.fantasyService.findUserTeams(query);
  }

  @Get("teams/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get fantasy team by ID" })
  @ApiResponse({
    status: 200,
    description: "Fantasy team retrieved successfully",
  })
  findTeamById(@Param("id") id: string) {
    return this.fantasyService.findTeamById(id);
  }

  @Get("teams/:id/points")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get fantasy team points" })
  @ApiResponse({
    status: 200,
    description: "Team points retrieved successfully",
  })
  getTeamPoints(@Param("id") id: string) {
    return this.fantasyService.getTeamPoints(id);
  }

  @Patch("teams/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update fantasy team" })
  @ApiResponse({
    status: 200,
    description: "Fantasy team updated successfully",
  })
  updateTeam(@Param("id") id: string, @Body() updateTeamDto: any) {
    return this.fantasyService.updateTeam(id, updateTeamDto);
  }

  @Delete("teams/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete fantasy team" })
  @ApiResponse({
    status: 200,
    description: "Fantasy team deleted successfully",
  })
  removeTeam(@Param("id") id: string) {
    return this.fantasyService.removeTeam(id);
  }

  // Fantasy Contests
  @Post("contests")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create fantasy contest" })
  @ApiResponse({
    status: 201,
    description: "Fantasy contest created successfully",
  })
  createContest(@Body() createContestDto: any) {
    return this.fantasyService.createContest(createContestDto);
  }

  @Get("contests")
  @ApiOperation({ summary: "Get all fantasy contests" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Fantasy contests retrieved successfully",
  })
  findAllContests(
    @Query()
    query: PaginationQueryDto & {
      status?: string;
    }
  ) {
    return this.fantasyService.findAllContests(query);
  }

  @Get("contests/:id")
  @ApiOperation({ summary: "Get fantasy contest by ID" })
  @ApiResponse({
    status: 200,
    description: "Fantasy contest retrieved successfully",
  })
  findContestById(@Param("id") id: string) {
    return this.fantasyService.findContestById(id);
  }

  @Patch("contests/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update fantasy contest" })
  @ApiResponse({
    status: 200,
    description: "Fantasy contest updated successfully",
  })
  updateContest(@Param("id") id: string, @Body() updateContestDto: any) {
    return this.fantasyService.updateContest(id, updateContestDto);
  }

  @Delete("contests/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete fantasy contest" })
  @ApiResponse({
    status: 200,
    description: "Fantasy contest deleted successfully",
  })
  removeContest(@Param("id") id: string) {
    return this.fantasyService.removeContest(id);
  }
}
