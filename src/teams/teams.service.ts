import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Team, TeamDocument } from "./schemas/team.schema";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { PaginationQueryDto } from "../common/dto/pagination.dto";
import { PaginationResponseDto } from "../common/dto/pagination.dto";

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    // Check if team already exists
    const existingTeam = await this.findByName(createTeamDto.name);
    if (existingTeam) {
      throw new ConflictException("Team name already exists");
    }

    const existingShortName = await this.findByShortName(
      createTeamDto.shortName
    );
    if (existingShortName) {
      throw new ConflictException("Team short name already exists");
    }

    const team = new this.teamModel(createTeamDto);
    return team.save();
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Team>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      this.teamModel
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 })
        .exec(),
      this.teamModel.countDocuments({ isActive: true }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: teams,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamModel.findById(id).exec();
    if (!team) {
      throw new NotFoundException("Team not found");
    }
    return team;
  }

  async findByName(name: string): Promise<Team | null> {
    return this.teamModel.findOne({ name }).exec();
  }

  async findByShortName(shortName: string): Promise<Team | null> {
    return this.teamModel.findOne({ shortName }).exec();
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    // Check if name or shortName already exists for other teams
    if (updateTeamDto.name) {
      const existingTeam = await this.teamModel.findOne({
        name: updateTeamDto.name,
        _id: { $ne: id },
      });
      if (existingTeam) {
        throw new ConflictException("Team name already exists");
      }
    }

    if (updateTeamDto.shortName) {
      const existingTeam = await this.teamModel.findOne({
        shortName: updateTeamDto.shortName,
        _id: { $ne: id },
      });
      if (existingTeam) {
        throw new ConflictException("Team short name already exists");
      }
    }

    const team = await this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    return team;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teamModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Team not found");
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.teamModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException("Team not found");
    }
  }
}
