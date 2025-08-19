import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { OddsService } from "./odds.service";
import { CreateOddsDto } from "./dto/create-odds.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("odds")
@Controller("api/matches/:matchId/odds")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Create new odds for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Odds successfully created",
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid odds data" })
  create(
    @Param("matchId") matchId: string,
    @Body() createOddsDto: CreateOddsDto
  ) {
    return this.oddsService.create(matchId, createOddsDto);
  }

  @Post("ai")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Generate AI-calculated odds for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "AI odds successfully generated",
  })
  generateAIOdds(@Param("matchId") matchId: string) {
    return this.oddsService.updateAIOdds(matchId);
  }

  @Get()
  @ApiOperation({ summary: "Get all odds for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Odds retrieved successfully",
  })
  findAll(@Param("matchId") matchId: string) {
    return this.oddsService.findAllByMatch(matchId);
  }

  @Get("latest")
  @ApiOperation({ summary: "Get latest odds for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Latest odds retrieved successfully",
  })
  findLatest(@Param("matchId") matchId: string) {
    return this.oddsService.findLatestByMatch(matchId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get odds by ID" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "id", description: "Odds ID" })
  @ApiResponse({
    status: 200,
    description: "Odds retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Odds not found" })
  findOne(@Param("id") id: string) {
    return this.oddsService.findById(id);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete odds (Admin only)" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "id", description: "Odds ID" })
  @ApiResponse({
    status: 200,
    description: "Odds deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Odds not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  remove(@Param("id") id: string) {
    return this.oddsService.remove(id);
  }
}
