import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  PlayerStats,
  PlayerStatsDocument,
} from "./schemas/player-stats.schema";
import { TeamStats, TeamStatsDocument } from "./schemas/team-stats.schema";
import { MatchStats, MatchStatsDocument } from "./schemas/match-stats.schema";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(PlayerStats.name)
    private playerStatsModel: Model<PlayerStatsDocument>,
    @InjectModel(TeamStats.name)
    private teamStatsModel: Model<TeamStatsDocument>,
    @InjectModel(MatchStats.name)
    private matchStatsModel: Model<MatchStatsDocument>
  ) {}

  async getPlayerStats(
    playerId: string,
    format: string = "ALL",
    period: string = "CAREER"
  ) {
    const stats = await this.playerStatsModel
      .findOne({ playerId: new Types.ObjectId(playerId), format, period })
      .populate("playerId", "fullName shortName photoUrl")
      .exec();

    if (!stats) {
      throw new NotFoundException("Player statistics not found");
    }

    return stats;
  }

  async getPlayerForm(playerId: string) {
    const stats = await this.playerStatsModel
      .findOne({ playerId: new Types.ObjectId(playerId) })
      .select("recentForm")
      .populate("recentForm.matchId", "name teamAId teamBId")
      .exec();

    if (!stats) {
      throw new NotFoundException("Player form not found");
    }

    return stats.recentForm;
  }

  async getPlayerH2H(playerId: string) {
    const stats = await this.playerStatsModel
      .findOne({ playerId: new Types.ObjectId(playerId) })
      .select("headToHead")
      .populate("headToHead.opponent", "name shortName")
      .exec();

    if (!stats) {
      throw new NotFoundException("Player H2H statistics not found");
    }

    return stats.headToHead;
  }

  async getPlayerVenuePerformance(playerId: string) {
    const stats = await this.playerStatsModel
      .findOne({ playerId: new Types.ObjectId(playerId) })
      .select("venuePerformance")
      .exec();

    if (!stats) {
      throw new NotFoundException("Player venue performance not found");
    }

    return stats.venuePerformance;
  }

  async getTeamStats(
    teamId: string,
    format: string = "ALL",
    period: string = "CAREER"
  ) {
    const stats = await this.teamStatsModel
      .findOne({ teamId: new Types.ObjectId(teamId), format, period })
      .populate("teamId", "name shortName logoUrl")
      .exec();

    if (!stats) {
      throw new NotFoundException("Team statistics not found");
    }

    return stats;
  }

  async getTeamPerformance(teamId: string) {
    const stats = await this.teamStatsModel
      .find({ teamId: new Types.ObjectId(teamId) })
      .sort({ lastUpdated: -1 })
      .limit(10)
      .exec();

    if (!stats.length) {
      throw new NotFoundException("Team performance data not found");
    }

    return stats;
  }

  async getTeamPlayerStats(teamId: string) {
    const playerStats = await this.playerStatsModel
      .find({ teamId: new Types.ObjectId(teamId) })
      .populate("playerId", "fullName shortName photoUrl")
      .sort({ "batting.runs": -1 })
      .exec();

    return playerStats;
  }

  async getMatchStats(matchId: string) {
    const stats = await this.matchStatsModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .populate("matchId", "name teamAId teamBId")
      .exec();

    if (!stats) {
      throw new NotFoundException("Match statistics not found");
    }

    return stats;
  }

  async getMatchInsights(matchId: string) {
    // This would contain match-specific insights and analysis
    const stats = await this.matchStatsModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .select("insights")
      .exec();

    if (!stats) {
      throw new NotFoundException("Match insights not found");
    }

    return stats.insights || {};
  }

  async getMatchTrends(matchId: string) {
    // This would contain performance trends for the match
    const stats = await this.matchStatsModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .select("trends")
      .exec();

    if (!stats) {
      throw new NotFoundException("Match trends not found");
    }

    return stats.trends || {};
  }

  async getBatsmenRankings(format: string = "ALL", limit: number = 10) {
    return this.playerStatsModel
      .find({ format, period: "CAREER" })
      .populate("playerId", "fullName shortName photoUrl")
      .sort({ "batting.runs": -1 })
      .limit(limit)
      .exec();
  }

  async getBowlersRankings(format: string = "ALL", limit: number = 10) {
    return this.playerStatsModel
      .find({ format, period: "CAREER" })
      .populate("playerId", "fullName shortName photoUrl")
      .sort({ "bowling.wickets": -1 })
      .limit(limit)
      .exec();
  }

  async getTeamRankings(format: string = "ALL", limit: number = 10) {
    return this.teamStatsModel
      .find({ format, period: "CAREER" })
      .populate("teamId", "name shortName logoUrl")
      .sort({ "performance.rating": -1 })
      .limit(limit)
      .exec();
  }

  async comparePlayers(playerIds: string[]) {
    const objectIds = playerIds.map((id) => new Types.ObjectId(id));

    const players = await this.playerStatsModel
      .find({
        playerId: { $in: objectIds },
        period: "CAREER",
      })
      .populate("playerId", "fullName shortName photoUrl")
      .exec();

    if (!players.length) {
      throw new NotFoundException("Player comparison data not found");
    }

    return players;
  }

  async compareTeams(teamIds: string[]) {
    const objectIds = teamIds.map((id) => new Types.ObjectId(id));

    const teams = await this.teamStatsModel
      .find({
        teamId: { $in: objectIds },
        period: "CAREER",
      })
      .populate("teamId", "name shortName logoUrl")
      .exec();

    if (!teams.length) {
      throw new NotFoundException("Team comparison data not found");
    }

    return teams;
  }
}
