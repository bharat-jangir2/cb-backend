import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { BallsService } from "./balls.service";
import { CreateBallDto } from "./dto/create-ball.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("balls")
@Controller("api/matches/:matchId/balls")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BallsController {
  constructor(private readonly ballsService: BallsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Add a new ball event" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 201,
    description: "Ball event successfully added",
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid ball data" })
  create(
    @Param("matchId") matchId: string,
    @Body() createBallDto: CreateBallDto
  ) {
    return this.ballsService.create(matchId, createBallDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all balls for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Balls retrieved successfully",
  })
  findAll(@Param("matchId") matchId: string) {
    return this.ballsService.findAllByMatch(matchId);
  }

  @Get("last")
  @ApiOperation({ summary: "Get the last ball of a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Last ball retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "No balls found" })
  findLastBall(@Param("matchId") matchId: string) {
    return this.ballsService.findLastBall(matchId);
  }

  @Post("undo")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Undo the last ball" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Last ball successfully undone",
  })
  @ApiResponse({ status: 404, description: "No balls found to undo" })
  undoLastBall(@Param("matchId") matchId: string) {
    return this.ballsService.undoLastBall(matchId);
  }

  @Post("undo/:ballId")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Undo a specific ball (must be the last ball)" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiParam({ name: "ballId", description: "Ball ID" })
  @ApiResponse({
    status: 200,
    description: "Ball successfully undone",
  })
  @ApiResponse({ status: 400, description: "Can only undo the last ball" })
  @ApiResponse({ status: 404, description: "Ball not found" })
  undoSpecificBall(
    @Param("matchId") matchId: string,
    @Param("ballId") ballId: string
  ) {
    return this.ballsService.undoSpecificBall(matchId, ballId);
  }
}
