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
import { NewsService } from "./news.service";
import { CreateNewsDto, UpdateNewsDto } from "./dto/create-news.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("news")
@Controller("api/news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create news article" })
  @ApiResponse({ status: 201, description: "News created successfully" })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all news articles" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "News retrieved successfully" })
  findAll(
    @Query()
    query: PaginationQueryDto & {
      category?: string;
      search?: string;
    }
  ) {
    return this.newsService.findAll({ ...query, isPublished: true });
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured news articles" })
  @ApiResponse({
    status: 200,
    description: "Featured news retrieved successfully",
  })
  getFeaturedNews(@Query("limit") limit?: number) {
    return this.newsService.getFeaturedNews(limit);
  }

  @Get("latest")
  @ApiOperation({ summary: "Get latest news articles" })
  @ApiResponse({
    status: 200,
    description: "Latest news retrieved successfully",
  })
  getLatestNews(@Query("limit") limit?: number) {
    return this.newsService.getLatestNews(limit);
  }

  @Get("popular")
  @ApiOperation({ summary: "Get popular news articles" })
  @ApiResponse({
    status: 200,
    description: "Popular news retrieved successfully",
  })
  getPopularNews(@Query("limit") limit?: number) {
    return this.newsService.getPopularNews(limit);
  }

  @Get("category/:category")
  @ApiOperation({ summary: "Get news by category" })
  @ApiResponse({
    status: 200,
    description: "Category news retrieved successfully",
  })
  getNewsByCategory(
    @Param("category") category: string,
    @Query("limit") limit?: number
  ) {
    return this.newsService.getNewsByCategory(category, limit);
  }

  @Get("search")
  @ApiOperation({ summary: "Search news articles" })
  @ApiQuery({ name: "q", required: true, type: String })
  @ApiResponse({
    status: 200,
    description: "Search results retrieved successfully",
  })
  searchNews(@Query("q") searchTerm: string, @Query("limit") limit?: number) {
    return this.newsService.searchNews(searchTerm, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get news article by ID" })
  @ApiResponse({ status: 200, description: "News retrieved successfully" })
  findOne(@Param("id") id: string) {
    return this.newsService.findById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update news article" })
  @ApiResponse({ status: 200, description: "News updated successfully" })
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Post(":id/like")
  @ApiOperation({ summary: "Like a news article" })
  @ApiResponse({ status: 200, description: "News liked successfully" })
  likeNews(@Param("id") id: string) {
    return this.newsService.likeNews(id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete news article" })
  @ApiResponse({ status: 200, description: "News deleted successfully" })
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }

  // Admin endpoints for managing unpublished news
  @Get("admin/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all news (including unpublished) - Admin only",
  })
  @ApiResponse({ status: 200, description: "All news retrieved successfully" })
  findAllAdmin(
    @Query()
    query: PaginationQueryDto & {
      category?: string;
      isPublished?: boolean;
      isFeatured?: boolean;
      search?: string;
    }
  ) {
    return this.newsService.findAll(query);
  }
}
