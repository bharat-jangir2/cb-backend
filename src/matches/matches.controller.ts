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
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { MatchesService } from "./matches.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { UpdateMatchStatusDto } from "./dto/match-status.dto";
import {
  StrikeRotationDto,
  UpdateStrikeRotationDto,
} from "./dto/strike-rotation.dto";
import { CommentaryDto, UpdateCommentaryDto } from "./dto/commentary.dto";
import {
  SquadDto,
  PlayingXIDto,
  UpdateSquadDto,
  UpdatePlayingXIDto,
  UpdateCaptainDto,
  UpdateViceCaptainDto,
  UpdateBattingOrderDto,
  UpdateWicketKeeperDto,
} from "./dto/squad.dto";
import { TossDto, NotificationDto, UpdateTossDto } from "./dto/toss.dto";
import {
  CreatePowerPlayDto,
  UpdatePowerPlayDto,
  PowerPlayStatsDto,
} from "./dto/power-play.dto";
import {
  CreateBallByBallDto,
  UpdateBallByBallDto,
  BallByBallFilterDto,
} from "./dto/ball-by-ball.dto";
import {
  CreateDRSReviewDto,
  UpdateDRSReviewDto,
  DRSReviewFilterDto,
} from "./dto/drs-review.dto";
import {
  CreateHighlightDto,
  UpdateHighlightDto,
  CreateTimelineEventDto,
  HighlightFilterDto,
  TimelineFilterDto,
} from "./dto/highlights.dto";
import {
  CreateFieldingPositionsDto,
  UpdateFieldingPositionsDto,
  FieldingPositionsFilterDto,
} from "./dto/fielding-positions.dto";
import { UpdateMatchSettingsDto } from "./dto/match-settings.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("matches")
@Controller("api/matches")
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // ===== PROTECTED ENDPOINTS (require authentication) =====

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Create a new match" })
  @ApiResponse({
    status: 201,
    description: "Match successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Teams must be different",
  })
  @ApiBearerAuth()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  // ===== PUBLIC ENDPOINTS (no authentication required) =====

  @Get()
  @ApiOperation({ summary: "Get all matches" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Matches retrieved successfully",
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.matchesService.findAll(paginationQuery);
  }

  @Get("live")
  @ApiOperation({ summary: "Get all live matches" })
  @ApiResponse({
    status: 200,
    description: "Live matches retrieved successfully",
  })
  findLiveMatches() {
    return this.matchesService.findLiveMatches();
  }

  @Get("debug/status")
  @ApiOperation({ summary: "Debug: Get all matches with their status" })
  @ApiResponse({
    status: 200,
    description: "All matches with status for debugging",
  })
  async debugMatchesStatus() {
    return this.matchesService.debugMatchesStatus();
  }

  @Get("status/:status")
  @ApiOperation({ summary: "Get matches by status" })
  @ApiParam({ name: "status", description: "Match status" })
  @ApiResponse({
    status: 200,
    description: "Matches retrieved successfully",
  })
  findByStatus(@Param("status") status: string) {
    return this.matchesService.findByStatus(status as any);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get match by ID" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  findOne(@Param("id") id: string) {
    return this.matchesService.findById(id);
  }

  @Get(":id/state")
  @ApiOperation({ summary: "Get current match state" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match state retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getMatchState(@Param("id") id: string) {
    return this.matchesService.getMatchState(id);
  }

  // ===== PROTECTED ENDPOINTS (require authentication) =====

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update match details" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiResponse({
    status: 400,
    description: "Bad request - Teams must be different",
  })
  @ApiBearerAuth()
  update(@Param("id") id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update match status" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid status transition",
  })
  @ApiBearerAuth()
  updateStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateMatchStatusDto
  ) {
    return this.matchesService.updateStatus(id, updateStatusDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete match (Admin only)" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  @ApiBearerAuth()
  remove(@Param("id") id: string) {
    return this.matchesService.remove(id);
  }

  // ===== PUBLIC ENDPOINTS (no authentication required) =====

  // Strike Rotation Management - GET is public
  @Get(":id/strike-rotation")
  @ApiOperation({ summary: "Get current strike rotation" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Strike rotation retrieved successfully",
  })
  getStrikeRotation(@Param("id") id: string) {
    return this.matchesService.getStrikeRotation(id);
  }

  // Commentary Management - GET is public
  @Get(":id/commentary")
  @ApiOperation({ summary: "Get match commentary" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiQuery({ name: "over", required: false, type: Number })
  @ApiQuery({ name: "innings", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Commentary retrieved successfully",
  })
  getCommentary(
    @Param("id") id: string,
    @Query("over") over?: number,
    @Query("innings") innings?: number
  ) {
    return this.matchesService.getCommentary(id, over, innings);
  }

  // Squad Management - GET is public
  @Get(":id/squad")
  @ApiOperation({ summary: "Get match squad" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Squad retrieved successfully",
  })
  getSquad(@Param("id") id: string) {
    return this.matchesService.getSquad(id);
  }

  // ===== PROTECTED ENDPOINTS (require authentication) =====

  // Strike Rotation Management - PATCH is protected
  @Patch(":id/strike-rotation")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update strike rotation" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Strike rotation updated successfully",
  })
  @ApiBearerAuth()
  updateStrikeRotation(
    @Param("id") id: string,
    @Body() updateStrikeRotationDto: UpdateStrikeRotationDto
  ) {
    return this.matchesService.updateStrikeRotation(
      id,
      updateStrikeRotationDto
    );
  }

  // Commentary Management - POST is protected
  @Post(":id/commentary")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add match commentary" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Commentary added successfully",
  })
  @ApiBearerAuth()
  addCommentary(@Param("id") id: string, @Body() commentaryDto: CommentaryDto) {
    return this.matchesService.addCommentary(id, commentaryDto);
  }

  // Squad Management - PATCH is protected
  @Patch(":id/squad")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update match squad" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Squad updated successfully",
  })
  @ApiBearerAuth()
  updateSquad(@Param("id") id: string, @Body() updateSquadDto: UpdateSquadDto) {
    return this.matchesService.updateSquad(id, updateSquadDto);
  }

  // ===== PUBLIC ENDPOINTS (no authentication required) =====

  // Innings Management - GET is public
  @Get(":id/innings")
  @ApiOperation({ summary: "Get all innings for match" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Innings retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getInnings(@Param("id") id: string) {
    return this.matchesService.getInnings(id);
  }

  @Get(":id/innings/:inningsNumber")
  @ApiOperation({ summary: "Get specific innings" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "inningsNumber", description: "Innings number (1 or 2)" })
  @ApiResponse({
    status: 200,
    description: "Innings retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match or innings not found" })
  getInningsByNumber(
    @Param("id") id: string,
    @Param("inningsNumber") inningsNumber: string
  ) {
    return this.matchesService.getInnings(id, parseInt(inningsNumber));
  }

  // Player Statistics - GET is public
  @Get(":id/player-stats")
  @ApiOperation({ summary: "Get player statistics" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Player statistics retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getPlayerStats(@Param("id") id: string) {
    return this.matchesService.getPlayerStats(id);
  }

  @Get(":id/player-stats/:playerId")
  @ApiOperation({ summary: "Get specific player statistics" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "playerId", description: "Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player statistics retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match or player not found" })
  getPlayerStatsById(
    @Param("id") id: string,
    @Param("playerId") playerId: string
  ) {
    return this.matchesService.getPlayerStatsById(id, playerId);
  }

  // Partnership Management - GET is public
  @Get(":id/partnerships")
  @ApiOperation({ summary: "Get partnerships" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Partnerships retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getPartnerships(@Param("id") id: string) {
    return this.matchesService.getPartnerships(id);
  }

  @Get(":id/partnerships/:innings")
  @ApiOperation({ summary: "Get partnerships by innings" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "innings", description: "Innings number" })
  @ApiResponse({
    status: 200,
    description: "Partnerships retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getPartnershipsByInnings(
    @Param("id") id: string,
    @Param("innings") innings: string
  ) {
    return this.matchesService.getPartnershipsByInnings(id, parseInt(innings));
  }

  // Live Match State - GET is public
  @Get(":id/live-state")
  @ApiOperation({ summary: "Get live match state" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Live match state retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getLiveState(@Param("id") id: string) {
    return this.matchesService.getLiveState(id);
  }

  // ===== PROTECTED ENDPOINTS (require authentication) =====

  // Innings Management - PATCH is protected
  @Patch(":id/innings/:inningsNumber")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update innings" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "inningsNumber", description: "Innings number (1 or 2)" })
  @ApiResponse({
    status: 200,
    description: "Innings updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or innings not found" })
  @ApiBearerAuth()
  updateInnings(
    @Param("id") id: string,
    @Param("inningsNumber") inningsNumber: string,
    @Body() updateData: any
  ) {
    return this.matchesService.updateInnings(
      id,
      parseInt(inningsNumber),
      updateData
    );
  }

  // Live Match State - PATCH is protected
  @Patch(":id/live-state")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update live match state" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Live match state updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiBearerAuth()
  updateLiveState(@Param("id") id: string, @Body() liveStateData: any) {
    return this.matchesService.updateLiveState(id, liveStateData);
  }

  // ===== PROTECTED ENDPOINTS (require authentication) =====

  // Playing XI Management
  @Patch(":id/playing-xi")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update playing XI" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Playing XI updated successfully",
  })
  @ApiBearerAuth()
  updatePlayingXI(@Param("id") id: string, @Body() playingXIDto: PlayingXIDto) {
    return this.matchesService.updatePlayingXI(id, playingXIDto);
  }

  @Get(":id/playing-xi")
  @ApiOperation({ summary: "Get playing XI" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Playing XI retrieved successfully",
  })
  getPlayingXI(@Param("id") id: string) {
    return this.matchesService.getPlayingXI(id);
  }

  // Captain Management
  @Patch(":id/captain")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update team captain" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Captain updated successfully",
  })
  @ApiBearerAuth()
  updateCaptain(
    @Param("id") id: string,
    @Body() updateCaptainDto: UpdateCaptainDto
  ) {
    return this.matchesService.updateCaptain(id, updateCaptainDto);
  }

  // Vice Captain Management
  @Patch(":id/vice-captain")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update team vice-captain" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Vice-captain updated successfully",
  })
  @ApiBearerAuth()
  updateViceCaptain(
    @Param("id") id: string,
    @Body() updateViceCaptainDto: UpdateViceCaptainDto
  ) {
    return this.matchesService.updateViceCaptain(id, updateViceCaptainDto);
  }

  // Batting Order Management
  @Patch(":id/batting-order")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update batting order" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Batting order updated successfully",
  })
  @ApiBearerAuth()
  updateBattingOrder(
    @Param("id") id: string,
    @Body() updateBattingOrderDto: UpdateBattingOrderDto
  ) {
    return this.matchesService.updateBattingOrder(id, updateBattingOrderDto);
  }

  // Wicket Keeper Management
  @Patch(":id/wicket-keeper")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update wicket-keeper" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Wicket-keeper updated successfully",
  })
  @ApiBearerAuth()
  updateWicketKeeper(
    @Param("id") id: string,
    @Body() updateWicketKeeperDto: UpdateWicketKeeperDto
  ) {
    return this.matchesService.updateWicketKeeper(id, updateWicketKeeperDto);
  }

  // Squad Team Management
  @Get(":id/squad/team/:team")
  @ApiOperation({ summary: "Get squad for specific team" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "team", description: "Team (A or B)" })
  @ApiResponse({
    status: 200,
    description: "Team squad retrieved successfully",
  })
  getSquadByTeam(@Param("id") id: string, @Param("team") team: string) {
    return this.matchesService.getSquadForTeam(id, team as "A" | "B");
  }

  @Get(":id/available-players/:team")
  @ApiOperation({ summary: "Get available players with capabilities" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "team", description: "Team (A or B)" })
  @ApiResponse({
    status: 200,
    description: "Available players retrieved successfully",
  })
  getAvailablePlayers(@Param("id") id: string, @Param("team") team: string) {
    return this.matchesService.getAvailablePlayersForTeam(
      id,
      team as "A" | "B"
    );
  }

  // Toss Management
  @Patch(":id/toss")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update toss information" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Toss information updated successfully",
  })
  @ApiBearerAuth()
  updateToss(@Param("id") id: string, @Body() updateTossDto: UpdateTossDto) {
    return this.matchesService.updateToss(id, updateTossDto);
  }

  @Get(":id/toss")
  @ApiOperation({ summary: "Get toss information" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Toss information retrieved successfully",
  })
  getToss(@Param("id") id: string) {
    return this.matchesService.getTossInfo(id);
  }

  // Notifications Management
  @Post(":id/notifications")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add match notification" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Notification added successfully",
  })
  @ApiBearerAuth()
  addNotification(
    @Param("id") id: string,
    @Body() notificationDto: NotificationDto
  ) {
    return this.matchesService.addNotification(id, notificationDto);
  }

  @Get(":id/notifications")
  @ApiOperation({ summary: "Get match notifications" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Notifications retrieved successfully",
  })
  getNotifications(@Param("id") id: string, @Query("type") type?: string) {
    return this.matchesService.getNotifications(id, type);
  }

  // WebSocket Stats Management
  @Get(":id/websocket-stats")
  @ApiOperation({ summary: "Get WebSocket connection stats" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "WebSocket stats retrieved successfully",
  })
  getWebSocketStats(@Param("id") id: string) {
    return this.matchesService.getWebSocketStats(id);
  }

  @Patch(":id/websocket-stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update WebSocket stats" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "WebSocket stats updated successfully",
  })
  @ApiBearerAuth()
  updateWebSocketStats(@Param("id") id: string, @Body() statsData: any) {
    return this.matchesService.updateWebSocketStats(id, statsData);
  }

  // Power Play Management
  @Post(":id/power-play")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Create power play" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Power play created successfully",
  })
  @ApiBearerAuth()
  createPowerPlay(
    @Param("id") id: string,
    @Body() createPowerPlayDto: CreatePowerPlayDto
  ) {
    return this.matchesService.addPowerPlay(id, createPowerPlayDto);
  }

  @Patch(":id/power-play/:powerPlayId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update power play" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "powerPlayId", description: "Power Play ID" })
  @ApiResponse({
    status: 200,
    description: "Power play updated successfully",
  })
  @ApiBearerAuth()
  updatePowerPlay(
    @Param("id") id: string,
    @Param("powerPlayId") powerPlayId: string,
    @Body() updatePowerPlayDto: UpdatePowerPlayDto
  ) {
    return this.matchesService.updatePowerPlay(
      id,
      parseInt(powerPlayId),
      updatePowerPlayDto
    );
  }

  @Get(":id/power-play")
  @ApiOperation({ summary: "Get power play information" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Power play information retrieved successfully",
  })
  getPowerPlay(@Param("id") id: string) {
    return this.matchesService.getCurrentPowerPlay(id);
  }

  // Ball-by-Ball Management
  @Post(":id/balls")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add ball event" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Ball event added successfully",
  })
  @ApiBearerAuth()
  addBall(
    @Param("id") id: string,
    @Body() createBallByBallDto: CreateBallByBallDto
  ) {
    return this.matchesService.addBall(id, createBallByBallDto);
  }

  @Get(":id/balls")
  @ApiOperation({ summary: "Get ball events" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Ball events retrieved successfully",
  })
  getBalls(@Param("id") id: string, @Query() filter: BallByBallFilterDto) {
    return this.matchesService.getBalls(id, filter);
  }

  @Patch(":id/balls/:ballId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update ball event" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "ballId", description: "Ball ID" })
  @ApiResponse({
    status: 200,
    description: "Ball event updated successfully",
  })
  @ApiBearerAuth()
  updateBall(
    @Param("id") id: string,
    @Param("ballId") ballId: string,
    @Body() updateBallByBallDto: UpdateBallByBallDto
  ) {
    return this.matchesService.updateBall(id, ballId, updateBallByBallDto);
  }

  // DRS Review Management
  @Post(":id/drs-reviews")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add DRS review" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "DRS review added successfully",
  })
  @ApiBearerAuth()
  addDRSReview(
    @Param("id") id: string,
    @Body() createDRSReviewDto: CreateDRSReviewDto
  ) {
    return this.matchesService.addDRSReview(id, createDRSReviewDto);
  }

  @Get(":id/drs-reviews")
  @ApiOperation({ summary: "Get DRS reviews" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "DRS reviews retrieved successfully",
  })
  getDRSReviews(@Param("id") id: string, @Query() filter: DRSReviewFilterDto) {
    return this.matchesService.getDRSReviews(id, filter);
  }

  @Patch(":id/drs-reviews/:reviewId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update DRS review" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "reviewId", description: "Review ID" })
  @ApiResponse({
    status: 200,
    description: "DRS review updated successfully",
  })
  @ApiBearerAuth()
  updateDRSReview(
    @Param("id") id: string,
    @Param("reviewId") reviewId: string,
    @Body() updateDRSReviewDto: UpdateDRSReviewDto
  ) {
    return this.matchesService.updateDRSReview(
      id,
      parseInt(reviewId),
      updateDRSReviewDto
    );
  }

  // Highlights Management
  @Post(":id/highlights")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add highlight" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Highlight added successfully",
  })
  @ApiBearerAuth()
  addHighlight(
    @Param("id") id: string,
    @Body() createHighlightDto: CreateHighlightDto
  ) {
    return this.matchesService.addHighlight(id, createHighlightDto);
  }

  @Get(":id/highlights")
  @ApiOperation({ summary: "Get highlights" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Highlights retrieved successfully",
  })
  getHighlights(@Param("id") id: string, @Query() filter: HighlightFilterDto) {
    return this.matchesService.getHighlights(id, filter);
  }

  @Patch(":id/highlights/:highlightId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update highlight" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "highlightId", description: "Highlight ID" })
  @ApiResponse({
    status: 200,
    description: "Highlight updated successfully",
  })
  @ApiBearerAuth()
  updateHighlight(
    @Param("id") id: string,
    @Param("highlightId") highlightId: string,
    @Body() updateHighlightDto: UpdateHighlightDto
  ) {
    return this.matchesService.updateHighlight(
      id,
      parseInt(highlightId),
      updateHighlightDto
    );
  }

  // Timeline Management
  @Post(":id/timeline")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add timeline event" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Timeline event added successfully",
  })
  @ApiBearerAuth()
  addTimelineEvent(
    @Param("id") id: string,
    @Body() createTimelineEventDto: CreateTimelineEventDto
  ) {
    return this.matchesService.addTimelineEvent(id, createTimelineEventDto);
  }

  @Get(":id/timeline")
  @ApiOperation({ summary: "Get match timeline" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Timeline retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getTimeline(@Param("id") id: string, @Query() filter: TimelineFilterDto) {
    return this.matchesService.getTimeline(id, filter);
  }

  // Fielding Positions Management
  @Post(":id/fielding-positions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add fielding positions" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Fielding positions added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiBearerAuth()
  addFieldingPositions(
    @Param("id") id: string,
    @Body() createFieldingPositionsDto: CreateFieldingPositionsDto
  ) {
    return this.matchesService.addFieldingPositions(
      id,
      createFieldingPositionsDto
    );
  }

  @Get(":id/fielding-positions")
  @ApiOperation({ summary: "Get fielding positions" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Fielding positions retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getFieldingPositions(
    @Param("id") id: string,
    @Query() filter: FieldingPositionsFilterDto
  ) {
    return this.matchesService.getFieldingPositions(id, filter);
  }

  @Patch(":id/fielding-positions/:positionIndex")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update fielding positions" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "positionIndex", description: "Position index" })
  @ApiResponse({
    status: 200,
    description: "Fielding positions updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or position not found" })
  @ApiBearerAuth()
  updateFieldingPositions(
    @Param("id") id: string,
    @Param("positionIndex") positionIndex: string,
    @Body() updateFieldingPositionsDto: UpdateFieldingPositionsDto
  ) {
    return this.matchesService.updateFieldingPositions(
      id,
      parseInt(positionIndex),
      updateFieldingPositionsDto
    );
  }

  // Match Settings Management
  @Patch(":id/settings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update match settings" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match settings updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiBearerAuth()
  updateMatchSettings(
    @Param("id") id: string,
    @Body() updateMatchSettingsDto: UpdateMatchSettingsDto
  ) {
    return this.matchesService.updateMatchSettings(id, updateMatchSettingsDto);
  }

  @Get(":id/settings")
  @ApiOperation({ summary: "Get match settings" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match settings retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getMatchSettings(@Param("id") id: string) {
    return this.matchesService.getMatchSettings(id);
  }

  @Post(":id/start")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Start live match (Admin/Scorer only)" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match started successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiResponse({ status: 400, description: "Match cannot be started" })
  @ApiBearerAuth()
  startMatch(@Param("id") id: string) {
    return this.matchesService.startMatch(id);
  }

  @Post(":id/end")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "End match (Admin/Scorer only)" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match ended successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  @ApiResponse({ status: 400, description: "Match cannot be ended" })
  @ApiBearerAuth()
  endMatch(@Param("id") id: string) {
    return this.matchesService.endMatch(id);
  }
}
