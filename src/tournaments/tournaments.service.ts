import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Tournament, TournamentDocument } from "./schemas/tournament.schema";
import { Series, SeriesDocument } from "./schemas/series.schema";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>
  ) {}

  // Tournament methods
  async create(createTournamentDto: any): Promise<Tournament> {
    const tournament = new this.tournamentModel(createTournamentDto);
    return tournament.save();
  }

  async findAll(
    query: PaginationQueryDto & {
      status?: string;
      format?: string;
    }
  ): Promise<{ tournaments: Tournament[]; total: number }> {
    const { page = 1, limit = 10, status, format } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (format) filter.format = format;

    const [tournaments, total] = await Promise.all([
      this.tournamentModel
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("participatingTeams", "name shortName logoUrl")
        .exec(),
      this.tournamentModel.countDocuments(filter),
    ]);

    return { tournaments, total };
  }

  async findById(id: string): Promise<Tournament> {
    const tournament = await this.tournamentModel
      .findById(id)
      .populate("participatingTeams", "name shortName logoUrl")
      .populate("matches", "name teamAId teamBId status")
      .populate("results.winner", "name shortName")
      .populate("results.runnerUp", "name shortName")
      .populate("results.thirdPlace", "name shortName")
      .populate("results.manOfTheSeries", "fullName shortName")
      .populate("results.bestBatsman", "fullName shortName")
      .populate("results.bestBowler", "fullName shortName")
      .populate("results.bestFielder", "fullName shortName")
      .exec();

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    return tournament;
  }

  async getPointsTable(id: string): Promise<any> {
    const tournament = await this.tournamentModel
      .findById(id)
      .select("pointsTable")
      .populate("pointsTable.team", "name shortName logoUrl")
      .exec();

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    return tournament.pointsTable;
  }

  async getResults(id: string): Promise<any> {
    const tournament = await this.tournamentModel
      .findById(id)
      .select("results")
      .populate("results.winner", "name shortName")
      .populate("results.runnerUp", "name shortName")
      .populate("results.thirdPlace", "name shortName")
      .populate("results.manOfTheSeries", "fullName shortName")
      .populate("results.bestBatsman", "fullName shortName")
      .populate("results.bestBowler", "fullName shortName")
      .populate("results.bestFielder", "fullName shortName")
      .exec();

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    return tournament.results;
  }

  async update(id: string, updateTournamentDto: any): Promise<Tournament> {
    const tournament = await this.tournamentModel
      .findByIdAndUpdate(id, updateTournamentDto, { new: true })
      .populate("participatingTeams", "name shortName logoUrl")
      .exec();

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    return tournament;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tournamentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Tournament not found");
    }
  }

  // Series methods
  async createSeries(createSeriesDto: any): Promise<Series> {
    const series = new this.seriesModel(createSeriesDto);
    return series.save();
  }

  async findAllSeries(
    query: PaginationQueryDto & {
      status?: string;
      type?: string;
    }
  ): Promise<{ series: Series[]; total: number }> {
    const { page = 1, limit = 10, status, type } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [series, total] = await Promise.all([
      this.seriesModel
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("participatingTeams", "name shortName logoUrl")
        .exec(),
      this.seriesModel.countDocuments(filter),
    ]);

    return { series, total };
  }

  async findSeriesById(id: string): Promise<Series> {
    const series = await this.seriesModel
      .findById(id)
      .populate("participatingTeams", "name shortName logoUrl")
      .populate("matches", "name teamAId teamBId status")
      .populate("results.winner", "name shortName")
      .populate("results.runnerUp", "name shortName")
      .populate("results.manOfTheSeries", "fullName shortName")
      .populate("results.bestBatsman", "fullName shortName")
      .populate("results.bestBowler", "fullName shortName")
      .exec();

    if (!series) {
      throw new NotFoundException("Series not found");
    }

    return series;
  }

  async getSeriesTable(id: string): Promise<any> {
    const series = await this.seriesModel
      .findById(id)
      .select("seriesTable")
      .populate("seriesTable.team", "name shortName logoUrl")
      .exec();

    if (!series) {
      throw new NotFoundException("Series not found");
    }

    return series.seriesTable;
  }

  async updateSeries(id: string, updateSeriesDto: any): Promise<Series> {
    const series = await this.seriesModel
      .findByIdAndUpdate(id, updateSeriesDto, { new: true })
      .populate("participatingTeams", "name shortName logoUrl")
      .exec();

    if (!series) {
      throw new NotFoundException("Series not found");
    }

    return series;
  }

  async removeSeries(id: string): Promise<void> {
    const result = await this.seriesModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Series not found");
    }
  }
}
