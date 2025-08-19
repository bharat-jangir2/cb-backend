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
import { CommunityService } from "./community.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@ApiTags("community")
@Controller("api/community")
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // Comments
  @Post("comments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add comment" })
  @ApiResponse({ status: 201, description: "Comment added successfully" })
  addComment(@Body() addCommentDto: any) {
    return this.communityService.addComment(addCommentDto);
  }

  @Get("comments")
  @ApiOperation({ summary: "Get comments" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "entityType", required: false, type: String })
  @ApiQuery({ name: "entityId", required: false, type: String })
  @ApiResponse({ status: 200, description: "Comments retrieved successfully" })
  getComments(
    @Query()
    query: PaginationQueryDto & {
      entityType?: string;
      entityId?: string;
    }
  ) {
    return this.communityService.getComments(query);
  }

  @Patch("comments/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update comment" })
  @ApiResponse({ status: 200, description: "Comment updated successfully" })
  updateComment(@Param("id") id: string, @Body() updateCommentDto: any) {
    return this.communityService.updateComment(id, updateCommentDto);
  }

  @Delete("comments/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({ status: 200, description: "Comment deleted successfully" })
  deleteComment(@Param("id") id: string) {
    return this.communityService.deleteComment(id);
  }

  @Post("comments/:id/like")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Like comment" })
  @ApiResponse({ status: 200, description: "Comment liked successfully" })
  likeComment(@Param("id") id: string) {
    return this.communityService.likeComment(id);
  }

  @Post("comments/:id/report")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Report comment" })
  @ApiResponse({ status: 200, description: "Comment reported successfully" })
  reportComment(@Param("id") id: string, @Body() reportDto: any) {
    return this.communityService.reportComment(id, reportDto);
  }

  // Discussions
  @Post("discussions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create discussion" })
  @ApiResponse({ status: 201, description: "Discussion created successfully" })
  createDiscussion(@Body() createDiscussionDto: any) {
    return this.communityService.createDiscussion(createDiscussionDto);
  }

  @Get("discussions")
  @ApiOperation({ summary: "Get discussions" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Discussions retrieved successfully",
  })
  getDiscussions(
    @Query()
    query: PaginationQueryDto & {
      category?: string;
    }
  ) {
    return this.communityService.getDiscussions(query);
  }

  @Get("discussions/:id")
  @ApiOperation({ summary: "Get discussion by ID" })
  @ApiResponse({
    status: 200,
    description: "Discussion retrieved successfully",
  })
  getDiscussionById(@Param("id") id: string) {
    return this.communityService.getDiscussionById(id);
  }

  @Patch("discussions/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update discussion" })
  @ApiResponse({ status: 200, description: "Discussion updated successfully" })
  updateDiscussion(@Param("id") id: string, @Body() updateDiscussionDto: any) {
    return this.communityService.updateDiscussion(id, updateDiscussionDto);
  }

  @Delete("discussions/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete discussion" })
  @ApiResponse({ status: 200, description: "Discussion deleted successfully" })
  deleteDiscussion(@Param("id") id: string) {
    return this.communityService.deleteDiscussion(id);
  }

  // Quizzes
  @Post("quizzes")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create quiz" })
  @ApiResponse({ status: 201, description: "Quiz created successfully" })
  createQuiz(@Body() createQuizDto: any) {
    return this.communityService.createQuiz(createQuizDto);
  }

  @Get("quizzes")
  @ApiOperation({ summary: "Get quizzes" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "difficulty", required: false, type: String })
  @ApiResponse({ status: 200, description: "Quizzes retrieved successfully" })
  getQuizzes(
    @Query()
    query: PaginationQueryDto & {
      category?: string;
      difficulty?: string;
    }
  ) {
    return this.communityService.getQuizzes(query);
  }

  @Get("quizzes/:id")
  @ApiOperation({ summary: "Get quiz by ID" })
  @ApiResponse({ status: 200, description: "Quiz retrieved successfully" })
  getQuizById(@Param("id") id: string) {
    return this.communityService.getQuizById(id);
  }

  @Post("quizzes/:id/submit")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Submit quiz answers" })
  @ApiResponse({ status: 200, description: "Quiz submitted successfully" })
  submitQuiz(@Param("id") id: string, @Body() submitDto: any) {
    return this.communityService.submitQuiz(id, submitDto);
  }

  @Get("quizzes/:id/results")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get quiz results" })
  @ApiResponse({
    status: 200,
    description: "Quiz results retrieved successfully",
  })
  getQuizResults(@Param("id") id: string) {
    return this.communityService.getQuizResults(id);
  }

  // Polls
  @Post("polls")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create poll" })
  @ApiResponse({ status: 201, description: "Poll created successfully" })
  createPoll(@Body() createPollDto: any) {
    return this.communityService.createPoll(createPollDto);
  }

  @Get("polls")
  @ApiOperation({ summary: "Get polls" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiResponse({ status: 200, description: "Polls retrieved successfully" })
  getPolls(
    @Query()
    query: PaginationQueryDto & {
      category?: string;
    }
  ) {
    return this.communityService.getPolls(query);
  }

  @Get("polls/:id")
  @ApiOperation({ summary: "Get poll by ID" })
  @ApiResponse({ status: 200, description: "Poll retrieved successfully" })
  getPollById(@Param("id") id: string) {
    return this.communityService.getPollById(id);
  }

  @Post("polls/:id/vote")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Vote in poll" })
  @ApiResponse({ status: 200, description: "Vote submitted successfully" })
  voteInPoll(@Param("id") id: string, @Body() voteDto: any) {
    return this.communityService.voteInPoll(id, voteDto);
  }

  @Get("polls/:id/results")
  @ApiOperation({ summary: "Get poll results" })
  @ApiResponse({
    status: 200,
    description: "Poll results retrieved successfully",
  })
  getPollResults(@Param("id") id: string) {
    return this.communityService.getPollResults(id);
  }
}
