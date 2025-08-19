import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { Discussion, DiscussionDocument } from "./schemas/discussion.schema";
import { Quiz, QuizDocument } from "./schemas/quiz.schema";
import { Poll, PollDocument } from "./schemas/poll.schema";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>
  ) {}

  // Comment methods
  async addComment(addCommentDto: any): Promise<Comment> {
    const comment = new this.commentModel(addCommentDto);
    return comment.save();
  }

  async getComments(
    query: PaginationQueryDto & {
      entityType?: string;
      entityId?: string;
    }
  ): Promise<{ comments: Comment[]; total: number }> {
    const { page = 1, limit = 10, entityType, entityId } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = new Types.ObjectId(entityId);

    const [comments, total] = await Promise.all([
      this.commentModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username email")
        .populate("parentComment", "content userId")
        .exec(),
      this.commentModel.countDocuments(filter),
    ]);

    return { comments, total };
  }

  async updateComment(id: string, updateCommentDto: any): Promise<Comment> {
    const comment = await this.commentModel
      .findByIdAndUpdate(
        id,
        { ...updateCommentDto, isEdited: true, editedAt: new Date() },
        { new: true }
      )
      .populate("userId", "username email")
      .exec();

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    const result = await this.commentModel
      .findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
      })
      .exec();

    if (!result) {
      throw new NotFoundException("Comment not found");
    }
  }

  async likeComment(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true })
      .exec();

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return comment;
  }

  async reportComment(id: string, reportDto: any): Promise<any> {
    const comment = await this.commentModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { reportCount: 1 },
          $addToSet: { reportedBy: reportDto.userId },
        },
        { new: true }
      )
      .exec();

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return { message: "Comment reported successfully" };
  }

  // Discussion methods
  async createDiscussion(createDiscussionDto: any): Promise<Discussion> {
    const discussion = new this.discussionModel(createDiscussionDto);
    return discussion.save();
  }

  async getDiscussions(
    query: PaginationQueryDto & {
      category?: string;
    }
  ): Promise<{ discussions: Discussion[]; total: number }> {
    const { page = 1, limit = 10, category } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (category) filter.category = category;

    const [discussions, total] = await Promise.all([
      this.discussionModel
        .find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username email")
        .populate("relatedMatch", "name teamAId teamBId")
        .populate("relatedPlayer", "fullName shortName")
        .populate("relatedTeam", "name shortName")
        .exec(),
      this.discussionModel.countDocuments(filter),
    ]);

    return { discussions, total };
  }

  async getDiscussionById(id: string): Promise<Discussion> {
    const discussion = await this.discussionModel
      .findById(id)
      .populate("userId", "username email")
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();

    if (!discussion) {
      throw new NotFoundException("Discussion not found");
    }

    // Increment view count
    await this.discussionModel.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
    });

    return discussion;
  }

  async updateDiscussion(
    id: string,
    updateDiscussionDto: any
  ): Promise<Discussion> {
    const discussion = await this.discussionModel
      .findByIdAndUpdate(id, updateDiscussionDto, { new: true })
      .populate("userId", "username email")
      .exec();

    if (!discussion) {
      throw new NotFoundException("Discussion not found");
    }

    return discussion;
  }

  async deleteDiscussion(id: string): Promise<void> {
    const result = await this.discussionModel
      .findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
      })
      .exec();

    if (!result) {
      throw new NotFoundException("Discussion not found");
    }
  }

  // Quiz methods
  async createQuiz(createQuizDto: any): Promise<Quiz> {
    const quiz = new this.quizModel(createQuizDto);
    return quiz.save();
  }

  async getQuizzes(
    query: PaginationQueryDto & {
      category?: string;
      difficulty?: string;
    }
  ): Promise<{ quizzes: Quiz[]; total: number }> {
    const { page = 1, limit = 10, category, difficulty } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isPublished: true, isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const [quizzes, total] = await Promise.all([
      this.quizModel
        .find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username email")
        .exec(),
      this.quizModel.countDocuments(filter),
    ]);

    return { quizzes, total };
  }

  async getQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizModel
      .findById(id)
      .populate("createdBy", "username email")
      .exec();

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    return quiz;
  }

  async submitQuiz(id: string, submitDto: any): Promise<any> {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    // Calculate score
    let score = 0;
    const results = [];

    for (let i = 0; i < submitDto.answers.length; i++) {
      const userAnswer = submitDto.answers[i];
      const correctAnswer = quiz.questions[i].correctAnswer;
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        score += quiz.questions[i].points;
      }

      results.push({
        question: quiz.questions[i].question,
        userAnswer,
        correctAnswer,
        isCorrect,
        points: isCorrect ? quiz.questions[i].points : 0,
        explanation: quiz.questions[i].explanation,
      });
    }

    // Update quiz statistics
    await this.quizModel.findByIdAndUpdate(id, {
      $inc: { attempts: 1 },
      $set: {
        averageScore:
          (quiz.averageScore * quiz.attempts + score) / (quiz.attempts + 1),
        highestScore: Math.max(quiz.highestScore, score),
      },
    });

    return {
      score,
      totalPoints: quiz.totalPoints,
      percentage: (score / quiz.totalPoints) * 100,
      results,
    };
  }

  async getQuizResults(id: string): Promise<any> {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    return {
      attempts: quiz.attempts,
      averageScore: quiz.averageScore,
      highestScore: quiz.highestScore,
      totalPoints: quiz.totalPoints,
    };
  }

  // Poll methods
  async createPoll(createPollDto: any): Promise<Poll> {
    const poll = new this.pollModel(createPollDto);
    return poll.save();
  }

  async getPolls(
    query: PaginationQueryDto & {
      category?: string;
    }
  ): Promise<{ polls: Poll[]; total: number }> {
    const { page = 1, limit = 10, category } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isPublished: true, isActive: true };
    if (category) filter.category = category;

    const [polls, total] = await Promise.all([
      this.pollModel
        .find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username email")
        .populate("relatedMatch", "name teamAId teamBId")
        .populate("relatedPlayer", "fullName shortName")
        .populate("relatedTeam", "name shortName")
        .exec(),
      this.pollModel.countDocuments(filter),
    ]);

    return { polls, total };
  }

  async getPollById(id: string): Promise<Poll> {
    const poll = await this.pollModel
      .findById(id)
      .populate("createdBy", "username email")
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();

    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    return poll;
  }

  async voteInPoll(id: string, voteDto: any): Promise<any> {
    const poll = await this.pollModel.findById(id);
    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    // Check if user already voted
    if (poll.votedBy.includes(voteDto.userId)) {
      throw new Error("User has already voted in this poll");
    }

    // Update vote counts
    const updatedOptions = poll.options.map((option, index) => {
      if (voteDto.optionIndex === index) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    // Calculate percentages
    const totalVotes = poll.totalVotes + 1;
    updatedOptions.forEach((option) => {
      option.percentage = (option.votes / totalVotes) * 100;
    });

    // Update poll
    await this.pollModel.findByIdAndUpdate(id, {
      options: updatedOptions,
      totalVotes,
      $addToSet: { votedBy: voteDto.userId },
    });

    return { message: "Vote submitted successfully" };
  }

  async getPollResults(id: string): Promise<any> {
    const poll = await this.pollModel.findById(id);
    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    return {
      question: poll.question,
      options: poll.options,
      totalVotes: poll.totalVotes,
      allowMultipleVotes: poll.allowMultipleVotes,
      isAnonymous: poll.isAnonymous,
    };
  }
}
