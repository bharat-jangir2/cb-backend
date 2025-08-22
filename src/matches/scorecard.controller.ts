import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ScorecardService } from "./scorecard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import {
  ScorecardResponseDto,
  TeamComparisonDto,
  PlayerPerformanceDto,
  InningsDto,
} from "./dto/scorecard.dto";

@ApiTags("scorecard")
@Controller("api/scorecard")
export class ScorecardController {
  constructor(private readonly scorecardService: ScorecardService) {}

  // ===== PUBLIC ENDPOINTS (no authentication required) =====

  @Get(":matchId")
  @ApiOperation({ summary: "Get complete scorecard for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Scorecard retrieved successfully",
    type: ScorecardResponseDto,
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getScorecard(@Param("matchId") matchId: string) {
    return this.scorecardService.getScorecard(matchId);
  }

  @Get(":matchId/live")
  @ApiOperation({ summary: "Get live scorecard with real-time updates" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Live scorecard retrieved successfully",
    type: ScorecardResponseDto,
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getLiveScorecard(@Param("matchId") matchId: string) {
    return this.scorecardService.getLiveScorecard(matchId);
  }

  @Get(":matchId/innings/:inningsNumber")
  @ApiOperation({ summary: "Get scorecard for specific innings" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "inningsNumber", description: "Innings number (1 or 2)" })
  @ApiResponse({
    status: 200,
    description: "Innings scorecard retrieved successfully",
    type: InningsDto,
  })
  @ApiResponse({ status: 404, description: "Match or innings not found" })
  getInningsScorecard(
    @Param("matchId") matchId: string,
    @Param("inningsNumber") inningsNumber: string
  ) {
    return this.scorecardService.getInningsScorecard(
      matchId,
      parseInt(inningsNumber)
    );
  }

  @Get(":matchId/player/:playerId")
  @ApiOperation({ summary: "Get player performance from scorecard" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "playerId", description: "Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player performance retrieved successfully",
    type: PlayerPerformanceDto,
  })
  @ApiResponse({ status: 404, description: "Match or player not found" })
  getPlayerPerformance(
    @Param("matchId") matchId: string,
    @Param("playerId") playerId: string
  ) {
    return this.scorecardService.getPlayerPerformance(matchId, playerId);
  }

  @Get(":matchId/team-comparison")
  @ApiOperation({ summary: "Get team comparison for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Team comparison retrieved successfully",
    type: TeamComparisonDto,
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getTeamComparison(@Param("matchId") matchId: string) {
    return this.scorecardService.getTeamComparison(matchId);
  }

  @Get("tournament/:tournamentId")
  @ApiOperation({ summary: "Get all scorecards for a tournament" })
  @ApiParam({ name: "tournamentId", description: "Tournament ID" })
  @ApiResponse({
    status: 200,
    description: "Tournament scorecards retrieved successfully",
    type: [ScorecardResponseDto],
  })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  getTournamentScorecards(@Param("tournamentId") tournamentId: string) {
    return this.scorecardService.getTournamentScorecards(tournamentId);
  }

  @Get("series/:seriesId")
  @ApiOperation({ summary: "Get all scorecards for a series" })
  @ApiParam({ name: "seriesId", description: "Series ID" })
  @ApiResponse({
    status: 200,
    description: "Series scorecards retrieved successfully",
    type: [ScorecardResponseDto],
  })
  @ApiResponse({ status: 404, description: "Series not found" })
  getSeriesScorecards(@Param("seriesId") seriesId: string) {
    return this.scorecardService.getSeriesScorecards(seriesId);
  }

  // ===== PROTECTED ENDPOINTS (require authentication) =====

  @Get(":matchId/refresh")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Force refresh scorecard data (Admin/Scorer only)" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Scorecard refreshed successfully",
    type: ScorecardResponseDto,
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  refreshScorecard(@Param("matchId") matchId: string) {
    return this.scorecardService.updateScorecard(matchId);
  }
}
