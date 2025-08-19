import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { News, NewsDocument } from "./schemas/news.schema";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/create-news.dto";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = new this.newsModel({
      ...createNewsDto,
      publishedAt: createNewsDto.isPublished ? new Date() : null,
    });

    if (createNewsDto.relatedMatch) {
      news.relatedMatch = new Types.ObjectId(createNewsDto.relatedMatch);
    }
    if (createNewsDto.relatedPlayer) {
      news.relatedPlayer = new Types.ObjectId(createNewsDto.relatedPlayer);
    }
    if (createNewsDto.relatedTeam) {
      news.relatedTeam = new Types.ObjectId(createNewsDto.relatedTeam);
    }

    return news.save();
  }

  async findAll(
    query: PaginationQueryDto & {
      category?: string;
      isPublished?: boolean;
      isFeatured?: boolean;
      search?: string;
    }
  ): Promise<{ news: News[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      category,
      isPublished,
      isFeatured,
      search,
    } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (category) filter.category = category;
    if (isPublished !== undefined) filter.isPublished = isPublished;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured;

    if (search) {
      filter.$text = { $search: search };
    }

    const [news, total] = await Promise.all([
      this.newsModel
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("relatedMatch", "name teamAId teamBId")
        .populate("relatedPlayer", "fullName shortName")
        .populate("relatedTeam", "name shortName")
        .exec(),
      this.newsModel.countDocuments(filter),
    ]);

    return { news, total };
  }

  async findById(id: string): Promise<News> {
    const news = await this.newsModel
      .findById(id)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();

    if (!news) {
      throw new NotFoundException("News not found");
    }

    // Increment view count
    await this.newsModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updateData: any = { ...updateNewsDto };

    if (updateNewsDto.relatedMatch) {
      updateData.relatedMatch = new Types.ObjectId(updateNewsDto.relatedMatch);
    }
    if (updateNewsDto.relatedPlayer) {
      updateData.relatedPlayer = new Types.ObjectId(
        updateNewsDto.relatedPlayer
      );
    }
    if (updateNewsDto.relatedTeam) {
      updateData.relatedTeam = new Types.ObjectId(updateNewsDto.relatedTeam);
    }

    // Set publishedAt if publishing for the first time
    if (updateNewsDto.isPublished) {
      const existingNews = await this.newsModel.findById(id);
      if (existingNews && !existingNews.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const news = await this.newsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();

    if (!news) {
      throw new NotFoundException("News not found");
    }

    return news;
  }

  async remove(id: string): Promise<void> {
    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("News not found");
    }
  }

  async getFeaturedNews(limit: number = 5): Promise<News[]> {
    return this.newsModel
      .find({ isFeatured: true, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();
  }

  async getLatestNews(limit: number = 10): Promise<News[]> {
    return this.newsModel
      .find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();
  }

  async getNewsByCategory(
    category: string,
    limit: number = 10
  ): Promise<News[]> {
    return this.newsModel
      .find({ category, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();
  }

  async searchNews(searchTerm: string, limit: number = 10): Promise<News[]> {
    return this.newsModel
      .find(
        { $text: { $search: searchTerm }, isPublished: true },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
      .limit(limit)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();
  }

  async likeNews(id: string): Promise<News> {
    const news = await this.newsModel
      .findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true })
      .exec();

    if (!news) {
      throw new NotFoundException("News not found");
    }

    return news;
  }

  async getPopularNews(limit: number = 10): Promise<News[]> {
    return this.newsModel
      .find({ isPublished: true })
      .sort({ viewCount: -1, likeCount: -1 })
      .limit(limit)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedPlayer", "fullName shortName")
      .populate("relatedTeam", "name shortName")
      .exec();
  }
}
