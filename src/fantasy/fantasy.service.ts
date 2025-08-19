import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  FantasyLeague,
  FantasyLeagueDocument,
} from "./schemas/fantasy-league.schema";
import {
  FantasyTeam,
  FantasyTeamDocument,
} from "./schemas/fantasy-team.schema";
import {
  FantasyContest,
  FantasyContestDocument,
} from "./schemas/fantasy-contest.schema";
import {
  FantasyPlayer,
  FantasyPlayerDocument,
} from "./schemas/fantasy-player.schema";
import { PaginationQueryDto } from "../common/dto/pagination.dto";

@Injectable()
export class FantasyService {
  constructor(
    @InjectModel(FantasyLeague.name)
    private fantasyLeagueModel: Model<FantasyLeagueDocument>,
    @InjectModel(FantasyTeam.name)
    private fantasyTeamModel: Model<FantasyTeamDocument>,
    @InjectModel(FantasyContest.name)
    private fantasyContestModel: Model<FantasyContestDocument>,
    @InjectModel(FantasyPlayer.name)
    private fantasyPlayerModel: Model<FantasyPlayerDocument>
  ) {}

  // Fantasy League methods
  async createLeague(createLeagueDto: any): Promise<FantasyLeague> {
    const league = new this.fantasyLeagueModel(createLeagueDto);
    return league.save();
  }

  async findAllLeagues(
    query: PaginationQueryDto & {
      status?: string;
      type?: string;
    }
  ): Promise<{ leagues: FantasyLeague[]; total: number }> {
    const { page = 1, limit = 10, status, type } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [leagues, total] = await Promise.all([
      this.fantasyLeagueModel
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("relatedMatch", "name teamAId teamBId")
        .populate("relatedTournament", "name shortName")
        .populate("relatedSeries", "name shortName")
        .exec(),
      this.fantasyLeagueModel.countDocuments(filter),
    ]);

    return { leagues, total };
  }

  async findLeagueById(id: string): Promise<FantasyLeague> {
    const league = await this.fantasyLeagueModel
      .findById(id)
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedTournament", "name shortName")
      .populate("relatedSeries", "name shortName")
      .populate("teams", "teamName totalPoints rank")
      .populate("participants", "username email")
      .exec();

    if (!league) {
      throw new NotFoundException("Fantasy league not found");
    }

    return league;
  }

  async joinLeague(id: string, joinDto: any): Promise<any> {
    const league = await this.fantasyLeagueModel.findById(id);
    if (!league) {
      throw new NotFoundException("Fantasy league not found");
    }

    // Add user to participants
    await this.fantasyLeagueModel.findByIdAndUpdate(id, {
      $addToSet: { participants: joinDto.userId },
      $inc: { currentTeams: 1 },
    });

    return { message: "Successfully joined fantasy league" };
  }

  async getLeaderboard(id: string): Promise<any> {
    const teams = await this.fantasyTeamModel
      .find({ leagueId: new Types.ObjectId(id) })
      .sort({ totalPoints: -1, rank: 1 })
      .populate("userId", "username email")
      .populate("players", "fullName shortName photoUrl")
      .populate("captaincy.captain", "fullName shortName")
      .populate("captaincy.viceCaptain", "fullName shortName")
      .exec();

    return teams;
  }

  async updateLeague(id: string, updateLeagueDto: any): Promise<FantasyLeague> {
    const league = await this.fantasyLeagueModel
      .findByIdAndUpdate(id, updateLeagueDto, { new: true })
      .populate("relatedMatch", "name teamAId teamBId")
      .populate("relatedTournament", "name shortName")
      .populate("relatedSeries", "name shortName")
      .exec();

    if (!league) {
      throw new NotFoundException("Fantasy league not found");
    }

    return league;
  }

  async removeLeague(id: string): Promise<void> {
    const result = await this.fantasyLeagueModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Fantasy league not found");
    }
  }

  // Fantasy Team methods
  async createTeam(createTeamDto: any): Promise<FantasyTeam> {
    const team = new this.fantasyTeamModel(createTeamDto);
    return team.save();
  }

  async findUserTeams(
    query: PaginationQueryDto & { leagueId?: string }
  ): Promise<{ teams: FantasyTeam[]; total: number }> {
    const { page = 1, limit = 10, leagueId } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (leagueId) filter.leagueId = new Types.ObjectId(leagueId);

    const [teams, total] = await Promise.all([
      this.fantasyTeamModel
        .find(filter)
        .sort({ lastUpdated: -1 })
        .skip(skip)
        .limit(limit)
        .populate("leagueId", "name description")
        .populate("players", "fullName shortName photoUrl role")
        .populate("captaincy.captain", "fullName shortName")
        .populate("captaincy.viceCaptain", "fullName shortName")
        .exec(),
      this.fantasyTeamModel.countDocuments(filter),
    ]);

    return { teams, total };
  }

  async findTeamById(id: string): Promise<FantasyTeam> {
    const team = await this.fantasyTeamModel
      .findById(id)
      .populate("leagueId", "name description")
      .populate("players", "fullName shortName photoUrl role")
      .populate("captaincy.captain", "fullName shortName")
      .populate("captaincy.viceCaptain", "fullName shortName")
      .exec();

    if (!team) {
      throw new NotFoundException("Fantasy team not found");
    }

    return team;
  }

  async getTeamPoints(id: string): Promise<any> {
    const team = await this.fantasyTeamModel
      .findById(id)
      .select("totalPoints rank")
      .exec();

    if (!team) {
      throw new NotFoundException("Fantasy team not found");
    }

    return { totalPoints: team.totalPoints, rank: team.rank };
  }

  async updateTeam(id: string, updateTeamDto: any): Promise<FantasyTeam> {
    const team = await this.fantasyTeamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .populate("leagueId", "name description")
      .populate("players", "fullName shortName photoUrl role")
      .populate("captaincy.captain", "fullName shortName")
      .populate("captaincy.viceCaptain", "fullName shortName")
      .exec();

    if (!team) {
      throw new NotFoundException("Fantasy team not found");
    }

    return team;
  }

  async removeTeam(id: string): Promise<void> {
    const result = await this.fantasyTeamModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Fantasy team not found");
    }
  }

  // Fantasy Contest methods
  async createContest(createContestDto: any): Promise<FantasyContest> {
    const contest = new this.fantasyContestModel(createContestDto);
    return contest.save();
  }

  async findAllContests(
    query: PaginationQueryDto & {
      status?: string;
    }
  ): Promise<{ contests: FantasyContest[]; total: number }> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;

    const [contests, total] = await Promise.all([
      this.fantasyContestModel
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("leagueId", "name description")
        .populate("teams", "teamName totalPoints rank")
        .populate("participants", "username email")
        .exec(),
      this.fantasyContestModel.countDocuments(filter),
    ]);

    return { contests, total };
  }

  async findContestById(id: string): Promise<FantasyContest> {
    const contest = await this.fantasyContestModel
      .findById(id)
      .populate("leagueId", "name description")
      .populate("teams", "teamName totalPoints rank")
      .populate("participants", "username email")
      .exec();

    if (!contest) {
      throw new NotFoundException("Fantasy contest not found");
    }

    return contest;
  }

  async updateContest(
    id: string,
    updateContestDto: any
  ): Promise<FantasyContest> {
    const contest = await this.fantasyContestModel
      .findByIdAndUpdate(id, updateContestDto, { new: true })
      .populate("leagueId", "name description")
      .populate("teams", "teamName totalPoints rank")
      .populate("participants", "username email")
      .exec();

    if (!contest) {
      throw new NotFoundException("Fantasy contest not found");
    }

    return contest;
  }

  async removeContest(id: string): Promise<void> {
    const result = await this.fantasyContestModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Fantasy contest not found");
    }
  }
}
