import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Match, MatchDocument } from "./schemas/match.schema";
import { Innings, InningsDocument } from "./schemas/innings.schema";
import { Ball, BallDocument } from "./schemas/ball.schema";
import {
  PlayerMatchStats,
  PlayerMatchStatsDocument,
} from "./schemas/player-match-stats.schema";
import { Partnership, PartnershipDocument } from "./schemas/partnership.schema";
import { MatchEvent, MatchEventDocument } from "./schemas/match-event.schema";
import { DRSReview, DRSReviewDocument } from "./schemas/drs-review.schema";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { UpdateMatchStatusDto } from "./dto/match-status.dto";
import {
  StrikeRotationDto,
  UpdateStrikeRotationDto,
} from "./dto/strike-rotation.dto";
import { CommentaryDto, UpdateCommentaryDto } from "./dto/commentary.dto";
import {
  SquadDto,
  PlayingXIDto,
  UpdateSquadDto,
  UpdatePlayingXIDto,
} from "./dto/squad.dto";
import { TossDto, NotificationDto, UpdateTossDto } from "./dto/toss.dto";
import { PaginationQueryDto } from "../common/dto/pagination.dto";
import { PaginationResponseDto } from "../common/dto/pagination.dto";
import { MatchStatus } from "../common/enums/match-status.enum";

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Innings.name) private inningsModel: Model<InningsDocument>,
    @InjectModel(Ball.name) private ballModel: Model<BallDocument>,
    @InjectModel(PlayerMatchStats.name)
    private playerMatchStatsModel: Model<PlayerMatchStatsDocument>,
    @InjectModel(Partnership.name)
    private partnershipModel: Model<PartnershipDocument>,
    @InjectModel(MatchEvent.name)
    private matchEventModel: Model<MatchEventDocument>,
    @InjectModel(DRSReview.name)
    private drsReviewModel: Model<DRSReviewDocument>
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    // Check if teams are different
    if (createMatchDto.teamAId === createMatchDto.teamBId) {
      throw new BadRequestException("Team A and Team B must be different");
    }

    const match = new this.matchModel({
      ...createMatchDto,
      teamAId: new Types.ObjectId(createMatchDto.teamAId),
      teamBId: new Types.ObjectId(createMatchDto.teamBId),
      status: MatchStatus.SCHEDULED,
    });

    return match.save();
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Match>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
      this.matchModel
        .find({ isActive: true })
        .populate("teamAId", "name shortName")
        .populate("teamBId", "name shortName")
        .skip(skip)
        .limit(limit)
        .sort({ startTime: -1 })
        .exec(),
      this.matchModel.countDocuments({ isActive: true }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: matches,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchModel
      .findById(id)
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName")
      .populate("tossWinner", "name shortName")
      .populate("manOfTheMatch", "fullName shortName")
      .exec();

    if (!match) {
      throw new NotFoundException("Match not found");
    }
    return match;
  }

  async findByStatus(status: MatchStatus): Promise<Match[]> {
    return this.matchModel
      .find({ status, isActive: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName")
      .sort({ startTime: -1 })
      .exec();
  }

  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findById(id);

    if (updateMatchDto.teamAId && updateMatchDto.teamBId) {
      if (updateMatchDto.teamAId === updateMatchDto.teamBId) {
        throw new BadRequestException("Team A and Team B must be different");
      }
    }

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(
        id,
        {
          ...updateMatchDto,
          ...(updateMatchDto.teamAId && {
            teamAId: new Types.ObjectId(updateMatchDto.teamAId),
          }),
          ...(updateMatchDto.teamBId && {
            teamBId: new Types.ObjectId(updateMatchDto.teamBId),
          }),
        },
        { new: true }
      )
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName")
      .populate("tossWinner", "name shortName")
      .populate("manOfTheMatch", "fullName shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async remove(id: string): Promise<void> {
    const match = await this.findById(id);
    await this.matchModel.findByIdAndUpdate(id, { isActive: false });
  }

  // Match Status Management
  async updateMatchStatus(
    id: string,
    updateMatchStatusDto: UpdateMatchStatusDto
  ): Promise<Match> {
    const match = await this.findById(id);

    const updateData: any = {
      status: updateMatchStatusDto.status,
    };

    if (updateMatchStatusDto.tossWinner) {
      updateData.tossWinner = new Types.ObjectId(
        updateMatchStatusDto.tossWinner
      );
    }

    if (updateMatchStatusDto.tossDecision) {
      updateData.tossDecision = updateMatchStatusDto.tossDecision;
    }

    if (updateMatchStatusDto.currentInnings !== undefined) {
      updateData.currentInnings = updateMatchStatusDto.currentInnings;
    }

    if (updateMatchStatusDto.currentOver !== undefined) {
      updateData.currentOver = updateMatchStatusDto.currentOver;
    }

    if (updateMatchStatusDto.currentBall !== undefined) {
      updateData.currentBall = updateMatchStatusDto.currentBall;
    }

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName")
      .populate("tossWinner", "name shortName")
      .populate("manOfTheMatch", "fullName shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  // Get match with complete data (for detailed views)
  async getMatchWithCompleteData(id: string): Promise<any> {
    const match = await this.findById(id);

    // Get current innings data
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(id),
      inningsNumber: match.currentInnings,
    });

    // Get recent balls
    const recentBalls = await this.ballModel
      .find({ matchId: new Types.ObjectId(id) })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("striker nonStriker bowler", "fullName shortName");

    // Get player stats
    const playerStats = await this.playerMatchStatsModel
      .find({ matchId: new Types.ObjectId(id) })
      .populate("player team", "fullName shortName name");

    // Get partnerships
    const partnerships = await this.partnershipModel
      .find({ matchId: new Types.ObjectId(id) })
      .populate("player1 player2", "fullName shortName");

    // Get recent events
    const recentEvents = await this.matchEventModel
      .find({ matchId: new Types.ObjectId(id) })
      .sort({ time: -1 })
      .limit(20);

    return {
      match,
      currentInnings,
      recentBalls,
      playerStats,
      partnerships,
      recentEvents,
    };
  }

  // Innings Management
  async getInnings(matchId: string, inningsNumber?: number): Promise<any> {
    const query: any = { matchId: new Types.ObjectId(matchId) };
    if (inningsNumber !== undefined) {
      query.inningsNumber = inningsNumber;
    }

    const innings = await this.inningsModel
      .find(query)
      .populate("battingTeam bowlingTeam", "name shortName")
      .sort({ inningsNumber: 1 });

    return innings;
  }

  async updateInnings(
    matchId: string,
    inningsNumber: number,
    updateData: any
  ): Promise<Innings> {
    const innings = await this.inningsModel.findOneAndUpdate(
      { matchId: new Types.ObjectId(matchId), inningsNumber },
      updateData,
      { new: true }
    );

    if (!innings) {
      throw new NotFoundException("Innings not found");
    }

    return innings;
  }

  // Ball Management
  async addBall(matchId: string, ballData: any): Promise<Ball> {
    const ball = new this.ballModel({
      matchId: new Types.ObjectId(matchId),
      ...ballData,
      striker: new Types.ObjectId(ballData.striker),
      nonStriker: new Types.ObjectId(ballData.nonStriker),
      bowler: new Types.ObjectId(ballData.bowler),
    });

    return ball.save();
  }

  async getBalls(matchId: string, filter: any = {}): Promise<Ball[]> {
    const query: any = { matchId: new Types.ObjectId(matchId) };

    if (filter.innings !== undefined) query.innings = filter.innings;
    if (filter.over !== undefined) query.over = filter.over;
    if (filter.eventType) query.eventType = filter.eventType;

    return this.ballModel
      .find(query)
      .populate("striker nonStriker bowler", "fullName shortName")
      .sort({ innings: 1, over: 1, ball: 1 });
  }

  async updateBall(
    matchId: string,
    ballId: string,
    updateData: any
  ): Promise<Ball> {
    const ball = await this.ballModel.findByIdAndUpdate(ballId, updateData, {
      new: true,
    });

    if (!ball) {
      throw new NotFoundException("Ball not found");
    }

    return ball;
  }

  // Player Stats Management
  async getPlayerStats(matchId: string, playerId?: string): Promise<any[]> {
    const query: any = { matchId: new Types.ObjectId(matchId) };
    if (playerId) {
      query.player = new Types.ObjectId(playerId);
    }

    return this.playerMatchStatsModel
      .find(query)
      .populate("player team", "fullName shortName name");
  }

  async updatePlayerStats(
    matchId: string,
    playerId: string,
    statsData: any
  ): Promise<PlayerMatchStats> {
    const stats = await this.playerMatchStatsModel.findOneAndUpdate(
      {
        matchId: new Types.ObjectId(matchId),
        player: new Types.ObjectId(playerId),
      },
      statsData,
      { new: true, upsert: true }
    );

    return stats;
  }

  // Partnership Management
  async getPartnerships(matchId: string, innings?: number): Promise<any[]> {
    const query: any = { matchId: new Types.ObjectId(matchId) };
    if (innings !== undefined) {
      query.innings = innings;
    }

    return this.partnershipModel
      .find(query)
      .populate("player1 player2", "fullName shortName")
      .sort({ runs: -1 });
  }

  // Event Management
  async addEvent(matchId: string, eventData: any): Promise<MatchEvent> {
    const event = new this.matchEventModel({
      matchId: new Types.ObjectId(matchId),
      ...eventData,
      time: new Date(),
    });

    return event.save();
  }

  async getEvents(matchId: string, filter: any = {}): Promise<MatchEvent[]> {
    const query: any = { matchId: new Types.ObjectId(matchId) };

    if (filter.eventType) query.eventType = filter.eventType;
    if (filter.isHighlight !== undefined)
      query.isHighlight = filter.isHighlight;
    if (filter.category) query.category = filter.category;

    return this.matchEventModel
      .find(query)
      .populate("players teams", "fullName shortName name")
      .sort({ time: -1 });
  }

  // DRS Review Management
  async addDRSReview(matchId: string, reviewData: any): Promise<DRSReview> {
    const review = new this.drsReviewModel({
      matchId: new Types.ObjectId(matchId),
      ...reviewData,
      requestingTeam: new Types.ObjectId(reviewData.requestingTeam),
      requestingPlayer: new Types.ObjectId(reviewData.requestingPlayer),
      reviewedPlayer: new Types.ObjectId(reviewData.reviewedPlayer),
    });

    return review.save();
  }

  async getDRSReviews(matchId: string, filter: any = {}): Promise<DRSReview[]> {
    const query: any = { matchId: new Types.ObjectId(matchId) };

    if (filter.reviewType) query.reviewType = filter.reviewType;
    if (filter.finalDecision) query.finalDecision = filter.finalDecision;
    if (filter.wasSuccessful !== undefined)
      query.wasSuccessful = filter.wasSuccessful;

    return this.drsReviewModel
      .find(query)
      .populate(
        "requestingTeam requestingPlayer reviewedPlayer",
        "name fullName shortName"
      )
      .sort({ timestamp: -1 });
  }

  // Legacy methods for backward compatibility (returning empty arrays or basic data)
  async getTossInfo(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return {
      completed: !!match.tossWinner,
      winner: match.tossWinner,
      decision: match.tossDecision,
      timestamp: new Date(),
      notified: false,
    };
  }

  async getPowerPlays(matchId: string): Promise<any[]> {
    // Power plays are now stored in Innings collection
    const innings = await this.getInnings(matchId);
    return innings.flatMap((inning) => inning.powerPlays || []);
  }

  async getCurrentPowerPlay(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(matchId),
      inningsNumber: match.currentInnings,
    });

    return currentInnings?.currentPowerPlay || { isActive: false };
  }

  // Live match methods
  async getLiveMatches(): Promise<Match[]> {
    return this.matchModel
      .find({
        $or: [
          { status: MatchStatus.IN_PROGRESS, isActive: true },
          { "liveState.isLive": true, isActive: true },
        ],
      })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName")
      .sort({ startTime: -1 });
  }

  async updateLiveState(matchId: string, liveStateData: any): Promise<Match> {
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, { liveState: liveStateData }, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  // WebSocket and legacy methods for backward compatibility
  async getMatchState(matchId: string): Promise<any> {
    return this.getMatchWithCompleteData(matchId);
  }

  async updateStrikeRotation(
    matchId: string,
    strikeRotationData: any
  ): Promise<Match> {
    const updateData: any = {};

    if (strikeRotationData.striker) {
      updateData["currentPlayers.striker"] = new Types.ObjectId(
        strikeRotationData.striker
      );
    }
    if (strikeRotationData.nonStriker) {
      updateData["currentPlayers.nonStriker"] = new Types.ObjectId(
        strikeRotationData.nonStriker
      );
    }
    if (strikeRotationData.bowler) {
      updateData["currentPlayers.bowler"] = new Types.ObjectId(
        strikeRotationData.bowler
      );
    }

    updateData["currentPlayers.lastUpdated"] = new Date();

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, updateData, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async addCommentary(matchId: string, commentaryData: any): Promise<any> {
    return this.addEvent(matchId, {
      eventType: "commentary",
      event: "Ball Commentary",
      description: commentaryData.commentary,
      ball: commentaryData.ball,
      over: commentaryData.over,
      innings: commentaryData.innings,
      category: "scoring",
      commentary: commentaryData.commentary,
      commentator: commentaryData.commentator,
    });
  }

  async updateToss(matchId: string, tossData: any): Promise<Match> {
    const updateData: any = {};

    if (tossData.winner) {
      updateData.tossWinner = new Types.ObjectId(tossData.winner);
    }
    if (tossData.decision) {
      updateData.tossDecision = tossData.decision;
    }

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, updateData, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async updateSquad(matchId: string, squadData: any): Promise<Match> {
    const updateData: any = {};

    if (squadData.teamA) {
      updateData["squads.teamA"] = squadData.teamA.map(
        (playerId: string) => new Types.ObjectId(playerId)
      );
    }
    if (squadData.teamB) {
      updateData["squads.teamB"] = squadData.teamB.map(
        (playerId: string) => new Types.ObjectId(playerId)
      );
    }

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, updateData, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async updatePlayingXI(matchId: string, playingXIData: any): Promise<Match> {
    const updateData: any = {};

    if (playingXIData.teamA) {
      updateData["playingXI.teamA"] = playingXIData.teamA.map(
        (playerId: string) => new Types.ObjectId(playerId)
      );
    }
    if (playingXIData.teamB) {
      updateData["playingXI.teamB"] = playingXIData.teamB.map(
        (playerId: string) => new Types.ObjectId(playerId)
      );
    }

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, updateData, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async addNotification(matchId: string, notificationData: any): Promise<any> {
    return this.addEvent(matchId, {
      eventType: "notification",
      event: notificationData.type,
      description: notificationData.message,
      category: "notification",
      isNotification: true,
      notificationType: "in_app",
      notificationTitle: notificationData.type,
      notificationMessage: notificationData.message,
    });
  }

  // Additional methods for controller compatibility
  async updateStatus(matchId: string, statusData: any): Promise<Match> {
    return this.updateMatchStatus(matchId, statusData);
  }

  async findLiveMatches(): Promise<Match[]> {
    return this.getLiveMatches();
  }

  async debugMatchesStatus(): Promise<any[]> {
    const matches = await this.matchModel
      .find({ isActive: true })
      .select("_id name status liveState.isLive startTime")
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName")
      .sort({ startTime: -1 });

    return matches.map((match) => ({
      id: match._id,
      name: match.name,
      status: match.status,
      isLive: match.liveState?.isLive,
      startTime: match.startTime,
      teamA: match.teamAId,
      teamB: match.teamBId,
    }));
  }

  async getStrikeRotation(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return match.currentPlayers;
  }

  async getCommentary(
    matchId: string,
    over?: number,
    innings?: number
  ): Promise<any[]> {
    const filter: any = { eventType: "commentary" };
    if (over !== undefined) filter.over = over;
    if (innings !== undefined) filter.innings = innings;
    return this.getEvents(matchId, filter);
  }

  async getSquad(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return match.squads;
  }

  async getPlayingXI(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return match.playingXI;
  }

  async getNotifications(matchId: string, type?: string): Promise<any[]> {
    const filter: any = { isNotification: true };
    if (type) filter.eventType = type;
    return this.getEvents(matchId, filter);
  }

  async updateWebSocketStats(matchId: string, stats: any): Promise<Match> {
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, { websocketStats: stats }, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async getWebSocketStats(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return match.websocketStats;
  }

  async addPowerPlay(matchId: string, powerPlayData: any): Promise<any> {
    const match = await this.findById(matchId);
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(matchId),
      inningsNumber: match.currentInnings,
    });

    if (!currentInnings) {
      throw new NotFoundException("Current innings not found");
    }

    currentInnings.powerPlays.push(powerPlayData);
    return currentInnings.save();
  }

  async updatePowerPlay(
    matchId: string,
    powerPlayIndex: number,
    updateData: any
  ): Promise<any> {
    const match = await this.findById(matchId);
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(matchId),
      inningsNumber: match.currentInnings,
    });

    if (
      !currentInnings ||
      !currentInnings.powerPlays ||
      powerPlayIndex >= currentInnings.powerPlays.length
    ) {
      throw new NotFoundException("Power play not found");
    }

    Object.assign(currentInnings.powerPlays[powerPlayIndex], updateData);
    return currentInnings.save();
  }

  async activatePowerPlay(
    matchId: string,
    powerPlayIndex: number
  ): Promise<any> {
    const match = await this.findById(matchId);
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(matchId),
      inningsNumber: match.currentInnings,
    });

    if (
      !currentInnings ||
      !currentInnings.powerPlays ||
      powerPlayIndex >= currentInnings.powerPlays.length
    ) {
      throw new NotFoundException("Power play not found");
    }

    // Deactivate all power plays first
    currentInnings.powerPlays.forEach((pp, index) => {
      pp.isActive = index === powerPlayIndex;
      if (index === powerPlayIndex) {
        pp.status = "active";
        currentInnings.currentPowerPlay = {
          isActive: true,
          currentPowerPlayIndex: powerPlayIndex,
          type: pp.type,
          startOver: pp.startOver,
          endOver: pp.endOver,
          maxFieldersOutside: pp.maxFieldersOutside,
        };
      }
    });

    return currentInnings.save();
  }

  async deactivatePowerPlay(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(matchId),
      inningsNumber: match.currentInnings,
    });

    if (!currentInnings) {
      throw new NotFoundException("Current innings not found");
    }

    currentInnings.powerPlays.forEach((pp) => {
      pp.isActive = false;
      pp.status = "completed";
    });

    currentInnings.currentPowerPlay = {
      isActive: false,
      currentPowerPlayIndex: -1,
      maxFieldersOutside: 2,
    };

    return currentInnings.save();
  }

  async updatePowerPlayStats(
    matchId: string,
    powerPlayIndex: number,
    statsData: any
  ): Promise<any> {
    return this.updatePowerPlay(matchId, powerPlayIndex, { stats: statsData });
  }

  async autoManagePowerPlays(
    matchId: string,
    currentOver: number
  ): Promise<any> {
    const match = await this.findById(matchId);
    const currentInnings = await this.inningsModel.findOne({
      matchId: new Types.ObjectId(matchId),
      inningsNumber: match.currentInnings,
    });

    if (!currentInnings) {
      throw new NotFoundException("Current innings not found");
    }

    // Auto-activate power plays based on over
    currentInnings.powerPlays.forEach((pp, index) => {
      if (
        currentOver >= pp.startOver &&
        currentOver <= pp.endOver &&
        pp.status === "pending"
      ) {
        pp.isActive = true;
        pp.status = "active";
        currentInnings.currentPowerPlay = {
          isActive: true,
          currentPowerPlayIndex: index,
          type: pp.type,
          startOver: pp.startOver,
          endOver: pp.endOver,
          maxFieldersOutside: pp.maxFieldersOutside,
        };
      } else if (currentOver > pp.endOver && pp.status === "active") {
        pp.isActive = false;
        pp.status = "completed";
        currentInnings.currentPowerPlay = {
          isActive: false,
          currentPowerPlayIndex: -1,
          maxFieldersOutside: 2,
        };
      }
    });

    return currentInnings.save();
  }

  async addBallByBall(matchId: string, ballData: any): Promise<any> {
    return this.addBall(matchId, ballData);
  }

  async getBallByBall(matchId: string, filter: any = {}): Promise<any[]> {
    return this.getBalls(matchId, filter);
  }

  async updateBallByBall(
    matchId: string,
    ballIndex: number,
    updateData: any
  ): Promise<any> {
    // Get the ball by index
    const balls = await this.getBalls(matchId);
    if (ballIndex >= balls.length) {
      throw new NotFoundException("Ball not found");
    }

    const ball = balls[ballIndex];
    return this.updateBall(matchId, (ball as any)._id.toString(), updateData);
  }

  async updateDRSReview(
    matchId: string,
    reviewIndex: number,
    updateData: any
  ): Promise<any> {
    const reviews = await this.getDRSReviews(matchId);
    if (reviewIndex >= reviews.length) {
      throw new NotFoundException("DRS review not found");
    }

    const review = reviews[reviewIndex];
    return this.drsReviewModel.findByIdAndUpdate(
      (review as any)._id.toString(),
      updateData,
      { new: true }
    );
  }

  async addHighlight(matchId: string, highlightData: any): Promise<any> {
    return this.addEvent(matchId, {
      ...highlightData,
      eventType: "highlight",
      isHighlight: true,
    });
  }

  async getHighlights(matchId: string, filter: any = {}): Promise<any[]> {
    return this.getEvents(matchId, { ...filter, isHighlight: true });
  }

  async updateHighlight(
    matchId: string,
    highlightIndex: number,
    updateData: any
  ): Promise<any> {
    const highlights = await this.getHighlights(matchId);
    if (highlightIndex >= highlights.length) {
      throw new NotFoundException("Highlight not found");
    }

    const highlight = highlights[highlightIndex];
    return this.matchEventModel.findByIdAndUpdate(highlight._id, updateData, {
      new: true,
    });
  }

  async addTimelineEvent(matchId: string, eventData: any): Promise<any> {
    return this.addEvent(matchId, eventData);
  }

  async getTimeline(matchId: string, filter: any = {}): Promise<any[]> {
    return this.getEvents(matchId, filter);
  }

  async addFieldingPositions(
    matchId: string,
    positionsData: any
  ): Promise<any> {
    // Add fielding positions as an event
    return this.addEvent(matchId, {
      eventType: "fielding_positions",
      event: "Fielding Positions Updated",
      description: "Fielding positions have been updated",
      ball: positionsData.ball,
      over: positionsData.over,
      innings: positionsData.innings,
      category: "player_action",
      metadata: { positions: positionsData.positions },
    });
  }

  async getFieldingPositions(
    matchId: string,
    filter: any = {}
  ): Promise<any[]> {
    return this.getEvents(matchId, {
      ...filter,
      eventType: "fielding_positions",
    });
  }

  async updateFieldingPositions(
    matchId: string,
    positionIndex: number,
    updateData: any
  ): Promise<any> {
    const positions = await this.getFieldingPositions(matchId);
    if (positionIndex >= positions.length) {
      throw new NotFoundException("Fielding positions not found");
    }

    const position = positions[positionIndex];
    return this.matchEventModel.findByIdAndUpdate(position._id, updateData, {
      new: true,
    });
  }

  async updateMatchSettings(
    matchId: string,
    settingsData: any
  ): Promise<Match> {
    const updateData: any = {};

    if (settingsData.settings) {
      updateData.settings = settingsData.settings;
    }
    if (settingsData.liveState) {
      updateData.liveState = settingsData.liveState;
    }

    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(matchId, updateData, { new: true })
      .populate("teamAId", "name shortName")
      .populate("teamBId", "name shortName");

    if (!updatedMatch) {
      throw new NotFoundException("Match not found");
    }

    return updatedMatch;
  }

  async getMatchSettings(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return {
      settings: match.settings,
      liveState: match.liveState,
    };
  }

  async getPlayerStatsById(matchId: string, playerId: string): Promise<any> {
    const stats = await this.getPlayerStats(matchId, playerId);
    return stats.length > 0 ? stats[0] : null;
  }

  async getPartnershipsByInnings(
    matchId: string,
    innings: number
  ): Promise<any[]> {
    return this.getPartnerships(matchId, innings);
  }

  async getLiveState(matchId: string): Promise<any> {
    const match = await this.findById(matchId);
    return match.liveState;
  }
}
