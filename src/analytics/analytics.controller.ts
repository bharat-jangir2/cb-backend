import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("analytics")
@Controller("api/analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("players/:id/stats")
  @ApiOperation({ summary: "Get player statistics" })
  @ApiResponse({
    status: 200,
    description: "Player stats retrieved successfully",
  })
  getPlayerStats(
    @Param("id") playerId: string,
    @Query("format") format?: string,
    @Query("period") period?: string
  ) {
    return this.analyticsService.getPlayerStats(playerId, format, period);
  }

  @Get("players/:id/form")
  @ApiOperation({ summary: "Get player recent form" })
  @ApiResponse({
    status: 200,
    description: "Player form retrieved successfully",
  })
  getPlayerForm(@Param("id") playerId: string) {
    return this.analyticsService.getPlayerForm(playerId);
  }

  @Get("players/:id/h2h")
  @ApiOperation({ summary: "Get player head-to-head statistics" })
  @ApiResponse({ status: 200, description: "H2H stats retrieved successfully" })
  getPlayerH2H(@Param("id") playerId: string) {
    return this.analyticsService.getPlayerH2H(playerId);
  }

  @Get("players/:id/venue")
  @ApiOperation({ summary: "Get player venue performance" })
  @ApiResponse({
    status: 200,
    description: "Venue performance retrieved successfully",
  })
  getPlayerVenuePerformance(@Param("id") playerId: string) {
    return this.analyticsService.getPlayerVenuePerformance(playerId);
  }

  @Get("teams/:id/stats")
  @ApiOperation({ summary: "Get team statistics" })
  @ApiResponse({
    status: 200,
    description: "Team stats retrieved successfully",
  })
  getTeamStats(
    @Param("id") teamId: string,
    @Query("format") format?: string,
    @Query("period") period?: string
  ) {
    return this.analyticsService.getTeamStats(teamId, format, period);
  }

  @Get("teams/:id/performance")
  @ApiOperation({ summary: "Get team performance trends" })
  @ApiResponse({
    status: 200,
    description: "Performance trends retrieved successfully",
  })
  getTeamPerformance(@Param("id") teamId: string) {
    return this.analyticsService.getTeamPerformance(teamId);
  }

  @Get("teams/:id/players")
  @ApiOperation({ summary: "Get team player statistics" })
  @ApiResponse({
    status: 200,
    description: "Team player stats retrieved successfully",
  })
  getTeamPlayerStats(@Param("id") teamId: string) {
    return this.analyticsService.getTeamPlayerStats(teamId);
  }

  @Get("matches/:id/stats")
  @ApiOperation({ summary: "Get match statistics" })
  @ApiResponse({
    status: 200,
    description: "Match stats retrieved successfully",
  })
  getMatchStats(@Param("id") matchId: string) {
    return this.analyticsService.getMatchStats(matchId);
  }

  @Get("matches/:id/insights")
  @ApiOperation({ summary: "Get match insights" })
  @ApiResponse({
    status: 200,
    description: "Match insights retrieved successfully",
  })
  getMatchInsights(@Param("id") matchId: string) {
    return this.analyticsService.getMatchInsights(matchId);
  }

  @Get("matches/:id/trends")
  @ApiOperation({ summary: "Get match performance trends" })
  @ApiResponse({
    status: 200,
    description: "Performance trends retrieved successfully",
  })
  getMatchTrends(@Param("id") matchId: string) {
    return this.analyticsService.getMatchTrends(matchId);
  }

  @Get("rankings/batsmen")
  @ApiOperation({ summary: "Get top batsmen rankings" })
  @ApiResponse({
    status: 200,
    description: "Batsmen rankings retrieved successfully",
  })
  getBatsmenRankings(
    @Query("format") format?: string,
    @Query("limit") limit?: number
  ) {
    return this.analyticsService.getBatsmenRankings(format, limit);
  }

  @Get("rankings/bowlers")
  @ApiOperation({ summary: "Get top bowlers rankings" })
  @ApiResponse({
    status: 200,
    description: "Bowlers rankings retrieved successfully",
  })
  getBowlersRankings(
    @Query("format") format?: string,
    @Query("limit") limit?: number
  ) {
    return this.analyticsService.getBowlersRankings(format, limit);
  }

  @Get("rankings/teams")
  @ApiOperation({ summary: "Get team rankings" })
  @ApiResponse({
    status: 200,
    description: "Team rankings retrieved successfully",
  })
  getTeamRankings(
    @Query("format") format?: string,
    @Query("limit") limit?: number
  ) {
    return this.analyticsService.getTeamRankings(format, limit);
  }

  @Get("comparison/players")
  @ApiOperation({ summary: "Compare players" })
  @ApiQuery({ name: "playerIds", required: true, type: String })
  @ApiResponse({
    status: 200,
    description: "Player comparison retrieved successfully",
  })
  comparePlayers(@Query("playerIds") playerIds: string) {
    return this.analyticsService.comparePlayers(playerIds.split(","));
  }

  @Get("comparison/teams")
  @ApiOperation({ summary: "Compare teams" })
  @ApiQuery({ name: "teamIds", required: true, type: String })
  @ApiResponse({
    status: 200,
    description: "Team comparison retrieved successfully",
  })
  compareTeams(@Query("teamIds") teamIds: string) {
    return this.analyticsService.compareTeams(teamIds.split(","));
  }
}
