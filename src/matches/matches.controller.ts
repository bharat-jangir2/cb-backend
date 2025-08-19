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
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
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
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

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

  @Patch(":id")
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
  update(@Param("id") id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Patch(":id/status")
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
  updateStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateMatchStatusDto
  ) {
    return this.matchesService.updateStatus(id, updateStatusDto);
  }

  @Delete(":id")
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
  remove(@Param("id") id: string) {
    return this.matchesService.remove(id);
  }

  // Strike Rotation Management
  @Patch(":id/strike-rotation")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update strike rotation" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Strike rotation updated successfully",
  })
  updateStrikeRotation(
    @Param("id") id: string,
    @Body() updateStrikeRotationDto: UpdateStrikeRotationDto
  ) {
    return this.matchesService.updateStrikeRotation(
      id,
      updateStrikeRotationDto
    );
  }

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

  // Commentary Management
  @Post(":id/commentary")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add match commentary" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Commentary added successfully",
  })
  addCommentary(@Param("id") id: string, @Body() commentaryDto: CommentaryDto) {
    return this.matchesService.addCommentary(id, commentaryDto);
  }

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

  // Squad Management
  @Patch(":id/squad")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update match squad" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Squad updated successfully",
  })
  updateSquad(@Param("id") id: string, @Body() updateSquadDto: UpdateSquadDto) {
    return this.matchesService.updateSquad(id, updateSquadDto);
  }

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

  // Playing XI Management
  @Patch(":id/playing-xi")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update playing XI" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Playing XI updated successfully",
  })
  updatePlayingXI(
    @Param("id") id: string,
    @Body() updatePlayingXIDto: UpdatePlayingXIDto
  ) {
    return this.matchesService.updatePlayingXI(id, updatePlayingXIDto);
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

  // Toss Management
  @Patch(":id/toss")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update toss information" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Toss information updated successfully",
  })
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
  getTossInfo(@Param("id") id: string) {
    return this.matchesService.getTossInfo(id);
  }

  // Notifications Management
  @Post(":id/notifications")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add match notification" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Notification added successfully",
  })
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

  // WebSocket Connection Management
  @Patch(":id/websocket-stats")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update WebSocket connection stats" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "WebSocket stats updated successfully",
  })
  updateWebSocketStats(
    @Param("id") id: string,
    @Body() stats: { totalConnections?: number; activeConnections?: number }
  ) {
    return this.matchesService.updateWebSocketStats(id, stats);
  }

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

  // Power Play Management
  @Post(":id/power-plays")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add power play to match" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Power play added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  addPowerPlay(
    @Param("id") id: string,
    @Body() createPowerPlayDto: CreatePowerPlayDto
  ) {
    return this.matchesService.addPowerPlay(id, createPowerPlayDto);
  }

  @Get(":id/power-plays")
  @ApiOperation({ summary: "Get all power plays for match" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Power plays retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getPowerPlays(@Param("id") id: string) {
    return this.matchesService.getPowerPlays(id);
  }

  @Get(":id/power-plays/current")
  @ApiOperation({ summary: "Get current power play status" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Current power play retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getCurrentPowerPlay(@Param("id") id: string) {
    return this.matchesService.getCurrentPowerPlay(id);
  }

  @Patch(":id/power-plays/:powerPlayIndex")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update power play details" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "powerPlayIndex", description: "Power play index" })
  @ApiResponse({
    status: 200,
    description: "Power play updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or power play not found" })
  updatePowerPlay(
    @Param("id") id: string,
    @Param("powerPlayIndex") powerPlayIndex: string,
    @Body() updatePowerPlayDto: UpdatePowerPlayDto
  ) {
    return this.matchesService.updatePowerPlay(
      id,
      parseInt(powerPlayIndex),
      updatePowerPlayDto
    );
  }

  @Patch(":id/power-plays/:powerPlayIndex/activate")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Activate power play" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "powerPlayIndex", description: "Power play index" })
  @ApiResponse({
    status: 200,
    description: "Power play activated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or power play not found" })
  activatePowerPlay(
    @Param("id") id: string,
    @Param("powerPlayIndex") powerPlayIndex: string
  ) {
    return this.matchesService.activatePowerPlay(id, parseInt(powerPlayIndex));
  }

  @Patch(":id/power-plays/deactivate")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Deactivate current power play" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Power play deactivated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  deactivatePowerPlay(@Param("id") id: string) {
    return this.matchesService.deactivatePowerPlay(id);
  }

  @Patch(":id/power-plays/:powerPlayIndex/stats")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update power play statistics" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "powerPlayIndex", description: "Power play index" })
  @ApiResponse({
    status: 200,
    description: "Power play stats updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or power play not found" })
  updatePowerPlayStats(
    @Param("id") id: string,
    @Param("powerPlayIndex") powerPlayIndex: string,
    @Body() stats: PowerPlayStatsDto
  ) {
    return this.matchesService.updatePowerPlayStats(
      id,
      parseInt(powerPlayIndex),
      stats
    );
  }

  @Patch(":id/power-plays/auto-manage")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Auto-manage power plays based on current over" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Power plays auto-managed successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  autoManagePowerPlays(
    @Param("id") id: string,
    @Body() data: { currentOver: number; currentInnings: number }
  ) {
    return this.matchesService.autoManagePowerPlays(id, data.currentOver);
  }

  // Ball-by-Ball Management
  @Post(":id/ball-by-ball")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add ball-by-ball event" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Ball-by-ball event added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  addBallByBall(
    @Param("id") id: string,
    @Body() createBallByBallDto: CreateBallByBallDto
  ) {
    return this.matchesService.addBallByBall(id, createBallByBallDto);
  }

  @Get(":id/ball-by-ball")
  @ApiOperation({ summary: "Get ball-by-ball events" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Ball-by-ball events retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getBallByBall(@Param("id") id: string, @Query() filter: BallByBallFilterDto) {
    return this.matchesService.getBallByBall(id, filter);
  }

  @Patch(":id/ball-by-ball/:ballIndex")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update ball-by-ball event" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "ballIndex", description: "Ball index" })
  @ApiResponse({
    status: 200,
    description: "Ball-by-ball event updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or ball not found" })
  updateBallByBall(
    @Param("id") id: string,
    @Param("ballIndex") ballIndex: string,
    @Body() updateBallByBallDto: UpdateBallByBallDto
  ) {
    return this.matchesService.updateBallByBall(
      id,
      parseInt(ballIndex),
      updateBallByBallDto
    );
  }

  // DRS Reviews Management
  @Post(":id/drs-reviews")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add DRS review" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "DRS review added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
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
  @ApiResponse({ status: 404, description: "Match not found" })
  getDRSReviews(@Param("id") id: string, @Query() filter: DRSReviewFilterDto) {
    return this.matchesService.getDRSReviews(id, filter);
  }

  @Patch(":id/drs-reviews/:reviewIndex")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update DRS review" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "reviewIndex", description: "Review index" })
  @ApiResponse({
    status: 200,
    description: "DRS review updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or review not found" })
  updateDRSReview(
    @Param("id") id: string,
    @Param("reviewIndex") reviewIndex: string,
    @Body() updateDRSReviewDto: UpdateDRSReviewDto
  ) {
    return this.matchesService.updateDRSReview(
      id,
      parseInt(reviewIndex),
      updateDRSReviewDto
    );
  }

  // Highlights Management
  @Post(":id/highlights")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add match highlight" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Highlight added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  addHighlight(
    @Param("id") id: string,
    @Body() createHighlightDto: CreateHighlightDto
  ) {
    return this.matchesService.addHighlight(id, createHighlightDto);
  }

  @Get(":id/highlights")
  @ApiOperation({ summary: "Get match highlights" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Highlights retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  getHighlights(@Param("id") id: string, @Query() filter: HighlightFilterDto) {
    return this.matchesService.getHighlights(id, filter);
  }

  @Patch(":id/highlights/:highlightIndex")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update match highlight" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "highlightIndex", description: "Highlight index" })
  @ApiResponse({
    status: 200,
    description: "Highlight updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or highlight not found" })
  updateHighlight(
    @Param("id") id: string,
    @Param("highlightIndex") highlightIndex: string,
    @Body() updateHighlightDto: UpdateHighlightDto
  ) {
    return this.matchesService.updateHighlight(
      id,
      parseInt(highlightIndex),
      updateHighlightDto
    );
  }

  // Timeline Management
  @Post(":id/timeline")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add timeline event" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Timeline event added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
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
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add fielding positions" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Fielding positions added successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
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
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update fielding positions" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiParam({ name: "positionIndex", description: "Position index" })
  @ApiResponse({
    status: 200,
    description: "Fielding positions updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match or position not found" })
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update match settings" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match settings updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
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

  // Player Statistics Management
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

  // Partnership Management
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

  // Live Match State
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

  @Patch(":id/live-state")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update live match state" })
  @ApiParam({ name: "id", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Live match state updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match not found" })
  updateLiveState(@Param("id") id: string, @Body() liveStateData: any) {
    return this.matchesService.updateLiveState(id, liveStateData);
  }
}
