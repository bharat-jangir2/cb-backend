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
import { TournamentsService } from "./tournaments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("tournaments")
@Controller("api/tournaments")
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create tournament" })
  @ApiResponse({ status: 201, description: "Tournament created successfully" })
  create(@Body() createTournamentDto: any) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all tournaments" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "format", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Tournaments retrieved successfully",
  })
  findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: string;
      format?: string;
    }
  ) {
    return this.tournamentsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get tournament by ID" })
  @ApiResponse({
    status: 200,
    description: "Tournament retrieved successfully",
  })
  findOne(@Param("id") id: string) {
    return this.tournamentsService.findById(id);
  }

  @Get(":id/points")
  @ApiOperation({ summary: "Get tournament points table" })
  @ApiResponse({
    status: 200,
    description: "Points table retrieved successfully",
  })
  getPointsTable(@Param("id") id: string) {
    return this.tournamentsService.getPointsTable(id);
  }

  @Get(":id/results")
  @ApiOperation({ summary: "Get tournament results" })
  @ApiResponse({
    status: 200,
    description: "Tournament results retrieved successfully",
  })
  getResults(@Param("id") id: string) {
    return this.tournamentsService.getResults(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update tournament" })
  @ApiResponse({ status: 200, description: "Tournament updated successfully" })
  update(@Param("id") id: string, @Body() updateTournamentDto: any) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete tournament" })
  @ApiResponse({ status: 200, description: "Tournament deleted successfully" })
  remove(@Param("id") id: string) {
    return this.tournamentsService.remove(id);
  }
}

@ApiTags("series")
@Controller("api/series")
export class SeriesController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create series" })
  @ApiResponse({ status: 201, description: "Series created successfully" })
  create(@Body() createSeriesDto: any) {
    return this.tournamentsService.createSeries(createSeriesDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all series" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiResponse({ status: 200, description: "Series retrieved successfully" })
  findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: string;
      type?: string;
    }
  ) {
    return this.tournamentsService.findAllSeries(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get series by ID" })
  @ApiResponse({ status: 200, description: "Series retrieved successfully" })
  findOne(@Param("id") id: string) {
    return this.tournamentsService.findSeriesById(id);
  }

  @Get(":id/table")
  @ApiOperation({ summary: "Get series table" })
  @ApiResponse({
    status: 200,
    description: "Series table retrieved successfully",
  })
  getSeriesTable(@Param("id") id: string) {
    return this.tournamentsService.getSeriesTable(id);
  }

  @Get(":id/fixtures")
  @ApiOperation({ summary: "Get series fixtures" })
  @ApiResponse({
    status: 200,
    description: "Series fixtures retrieved successfully",
  })
  getSeriesFixtures(@Param("id") id: string) {
    return this.tournamentsService.getSeriesFixtures(id);
  }

  @Get(":id/points-table")
  @ApiOperation({ summary: "Get series points table (alias for table)" })
  @ApiResponse({
    status: 200,
    description: "Series points table retrieved successfully",
  })
  getSeriesPointsTable(@Param("id") id: string) {
    return this.tournamentsService.getSeriesTable(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update series" })
  @ApiResponse({ status: 200, description: "Series updated successfully" })
  update(@Param("id") id: string, @Body() updateSeriesDto: any) {
    return this.tournamentsService.updateSeries(id, updateSeriesDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete series" })
  @ApiResponse({ status: 200, description: "Series deleted successfully" })
  remove(@Param("id") id: string) {
    return this.tournamentsService.removeSeries(id);
  }
}
