import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { MatchPlayersService } from "./match-players.service";
import { CreateMatchPlayerDto } from "./dto/create-match-player.dto";
import { UpdateMatchPlayerDto } from "./dto/update-match-player.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("match-players")
@Controller("api/matches/:matchId/players")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MatchPlayersController {
  constructor(private readonly matchPlayersService: MatchPlayersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add a player to a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Player successfully added to match",
  })
  @ApiResponse({
    status: 409,
    description: "Player already assigned or captain/vice-captain exists",
  })
  create(
    @Param("matchId") matchId: string,
    @Body() createMatchPlayerDto: CreateMatchPlayerDto
  ) {
    return this.matchPlayersService.create(matchId, createMatchPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all players in a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Match players retrieved successfully",
  })
  findAll(@Param("matchId") matchId: string) {
    return this.matchPlayersService.findAllByMatch(matchId);
  }

  @Get("team/:teamId")
  @ApiOperation({ summary: "Get all players of a team in a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "teamId", description: "Team ID" })
  @ApiResponse({
    status: 200,
    description: "Team players retrieved successfully",
  })
  findByTeam(
    @Param("matchId") matchId: string,
    @Param("teamId") teamId: string
  ) {
    return this.matchPlayersService.findByMatchAndTeam(matchId, teamId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get match player by ID" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "id", description: "Match Player ID" })
  @ApiResponse({
    status: 200,
    description: "Match player retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Match player not found" })
  findOne(@Param("id") id: string) {
    return this.matchPlayersService.findById(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Update match player" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "id", description: "Match Player ID" })
  @ApiResponse({
    status: 200,
    description: "Match player updated successfully",
  })
  @ApiResponse({ status: 404, description: "Match player not found" })
  @ApiResponse({
    status: 409,
    description: "Captain/vice-captain already exists",
  })
  update(
    @Param("id") id: string,
    @Body() updateMatchPlayerDto: UpdateMatchPlayerDto
  ) {
    return this.matchPlayersService.update(id, updateMatchPlayerDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Remove player from match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "id", description: "Match Player ID" })
  @ApiResponse({
    status: 200,
    description: "Player successfully removed from match",
  })
  @ApiResponse({ status: 404, description: "Match player not found" })
  remove(@Param("id") id: string) {
    return this.matchPlayersService.remove(id);
  }
}
