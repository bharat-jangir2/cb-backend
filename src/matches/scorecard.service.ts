import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Scorecard, ScorecardDocument } from "./schemas/scorecard.schema";
import { Match, MatchDocument } from "./schemas/match.schema";
import { Innings, InningsDocument } from "./schemas/innings.schema";
import { Ball, BallDocument } from "./schemas/ball.schema";
import {
  PlayerMatchStats,
  PlayerMatchStatsDocument,
} from "./schemas/player-match-stats.schema";
import { Partnership, PartnershipDocument } from "./schemas/partnership.schema";

@Injectable()
export class ScorecardService {
  constructor(
    @InjectModel(Scorecard.name)
    private scorecardModel: Model<ScorecardDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Innings.name) private inningsModel: Model<InningsDocument>,
    @InjectModel(Ball.name) private ballModel: Model<BallDocument>,
    @InjectModel(PlayerMatchStats.name)
    private playerMatchStatsModel: Model<PlayerMatchStatsDocument>,
    @InjectModel(Partnership.name)
    private partnershipModel: Model<PartnershipDocument>
  ) {}

  /**
   * Get or create scorecard for a match
   */
  async getScorecard(matchId: string): Promise<ScorecardDocument> {
    let scorecard: ScorecardDocument | null = await this.scorecardModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .populate("matchId", "name venue startTime status teamAId teamBId")
      .populate("tournamentId", "name shortName")
      .populate("seriesId", "name shortName")
      .populate("innings.teamId", "name shortName")
      .populate("innings.batting.playerId", "fullName shortName")
      .populate("innings.bowling.playerId", "fullName shortName")
      .populate("innings.fallOfWickets.playerId", "fullName shortName")
      .populate("commentary.batsmanId", "fullName shortName")
      .populate("commentary.bowlerId", "fullName shortName")
      .populate("matchSummary.tossWinner", "name shortName")
      .populate("matchSummary.manOfTheMatch", "fullName shortName");

    if (!scorecard) {
      // Create new scorecard by aggregating data
      scorecard = await this.createScorecard(matchId);
    }

    return scorecard;
  }

  /**
   * Create scorecard by aggregating data from existing collections
   */
  async createScorecard(matchId: string): Promise<ScorecardDocument> {
    // Get match details
    const match = await this.matchModel
      .findById(matchId)
      .populate("teamAId teamBId", "name shortName")
      .populate("tossWinner", "name shortName")
      .populate("manOfTheMatch", "fullName shortName")
      .populate("tournamentId", "name shortName")
      .populate("seriesId", "name shortName");

    if (!match) {
      throw new NotFoundException("Match not found");
    }

    // Get innings data
    const innings = await this.inningsModel
      .find({ matchId: new Types.ObjectId(matchId) })
      .populate("battingTeam bowlingTeam", "name shortName")
      .sort({ inningsNumber: 1 });

    // Get player stats
    const playerStats = await this.playerMatchStatsModel
      .find({ matchId: new Types.ObjectId(matchId) })
      .populate("player team", "fullName shortName name");

    // Get balls for commentary and fall of wickets
    const balls = await this.ballModel
      .find({ matchId: new Types.ObjectId(matchId) })
      .populate("striker nonStriker bowler", "fullName shortName")
      .sort({ innings: 1, over: 1, ball: 1 });

    // Get partnerships
    const partnerships = await this.partnershipModel
      .find({ matchId: new Types.ObjectId(matchId) })
      .populate("player1 player2", "fullName shortName")
      .sort({ innings: 1, wicket: 1 });

    // Build innings data
    const inningsData = await this.buildInningsData(
      innings,
      playerStats,
      balls,
      partnerships
    );

    // Build commentary data
    const commentaryData = this.buildCommentaryData(balls);

    // Build match summary
    const matchSummary = this.buildMatchSummary(match);

    // Create scorecard
    const scorecard = new this.scorecardModel({
      matchId: new Types.ObjectId(matchId),
      tournamentId: match.tournamentId,
      seriesId: match.seriesId,
      matchNumber: match.matchNumber,
      round: match.round,
      innings: inningsData,
      commentary: commentaryData,
      matchSummary,
      lastUpdateTime: new Date(),
      version: 1,
    });

    return scorecard.save();
  }

  /**
   * Update scorecard when match data changes
   */
  async updateScorecard(matchId: string): Promise<ScorecardDocument> {
    // Delete existing scorecard
    await this.scorecardModel.deleteOne({
      matchId: new Types.ObjectId(matchId),
    });

    // Create new scorecard with updated data
    return this.createScorecard(matchId);
  }

  /**
   * Build innings data by aggregating from multiple collections
   */
  private async buildInningsData(
    innings: InningsDocument[],
    playerStats: PlayerMatchStatsDocument[],
    balls: BallDocument[],
    partnerships: PartnershipDocument[]
  ) {
    return innings.map((inning) => {
      // Get player stats for this innings
      const inningPlayerStats = playerStats.filter(
        (stat) => stat.innings === inning.inningsNumber
      );

      // Get balls for this innings
      const inningBalls = balls.filter(
        (ball) => ball.innings === inning.inningsNumber
      );

      // Get partnerships for this innings
      const inningPartnerships = partnerships.filter(
        (partnership) => partnership.innings === inning.inningsNumber
      );

      // Build batting stats
      const battingStats = this.buildBattingStats(
        inningPlayerStats,
        inningPartnerships,
        inning.inningsNumber
      );

      // Build bowling stats
      const bowlingStats = this.buildBowlingStats(
        inningPlayerStats,
        inning.inningsNumber
      );

      // Build fall of wickets
      const fallOfWickets = this.buildFallOfWickets(inningBalls);

      return {
        inningNumber: inning.inningsNumber,
        teamId: inning.battingTeam,
        runs: inning.runs,
        wickets: inning.wickets,
        overs: inning.overs,
        extras: inning.extras,
        boundaries: inning.boundaries,
        sixes: inning.sixes,
        runRate: inning.runRate,
        requiredRunRate: inning.requiredRunRate,
        status: inning.status,
        startTime: inning.startTime,
        endTime: inning.endTime,
        duration: inning.duration,
        result: inning.result,
        resultDescription: inning.resultDescription,
        drsReviewsUsed: inning.drsReviewsUsed,
        drsReviewsRemaining: inning.drsReviewsRemaining,
        batting: battingStats,
        bowling: bowlingStats,
        fallOfWickets,
        powerPlays: inning.powerPlays || [],
      };
    });
  }

  /**
   * Build batting statistics for an innings
   */
  private buildBattingStats(
    playerStats: PlayerMatchStatsDocument[],
    partnerships: PartnershipDocument[],
    inningsNumber: number
  ) {
    return playerStats
      .filter((stat) => stat.battingRuns > 0 || stat.battingBalls > 0)
      .map((stat) => {
        // Find partnership for this player
        const partnership = partnerships.find(
          (p) =>
            p.player1.toString() === stat.player.toString() ||
            p.player2.toString() === stat.player.toString()
        );

        return {
          playerId: stat.player,
          runs: stat.battingRuns,
          balls: stat.battingBalls,
          fours: stat.battingFours,
          sixes: stat.battingSixes,
          strikeRate: stat.battingStrikeRate,
          isOut: !!stat.battingDismissal,
          dismissal: stat.battingDismissal
            ? {
                type: stat.battingDismissal.type,
                bowler: stat.battingDismissal.bowler,
                caughtBy: stat.battingDismissal.caughtBy,
                runOutBy: stat.battingDismissal.runOutBy,
                stumpedBy: stat.battingDismissal.stumpedBy,
                description: stat.battingDismissal.description,
              }
            : undefined,
          partnership: partnership
            ? {
                partner:
                  partnership.player1.toString() === stat.player.toString()
                    ? partnership.player2
                    : partnership.player1,
                runs: partnership.runs,
                balls: partnership.balls,
              }
            : undefined,
        };
      })
      .sort((a, b) => b.runs - a.runs);
  }

  /**
   * Build bowling statistics for an innings
   */
  private buildBowlingStats(
    playerStats: PlayerMatchStatsDocument[],
    inningsNumber: number
  ) {
    return playerStats
      .filter((stat) => stat.bowlingOvers > 0 || stat.bowlingBalls > 0)
      .map((stat) => ({
        playerId: stat.player,
        overs: stat.bowlingOvers,
        balls: stat.bowlingBalls,
        maidens: stat.bowlingMaidens,
        runsConceded: stat.bowlingRuns,
        wickets: stat.bowlingWickets,
        economy: stat.bowlingEconomy,
        average: stat.bowlingAverage,
        strikeRate: stat.bowlingStrikeRate,
        extras: {
          wides: stat.bowlingExtras?.wides || 0,
          noBalls: stat.bowlingExtras?.noBalls || 0,
          byes: stat.bowlingExtras?.byes || 0,
          legByes: stat.bowlingExtras?.legByes || 0,
        },
      }))
      .sort((a, b) => b.wickets - a.wickets || a.runsConceded - b.runsConceded);
  }

  /**
   * Build fall of wickets from ball data
   */
  private buildFallOfWickets(balls: BallDocument[]) {
    const wickets = balls.filter((ball) => ball.eventType === "wicket");

    return wickets.map((ball, index) => ({
      runs: ball.scoreState?.teamARuns || ball.scoreState?.teamBRuns || 0,
      wicket: index + 1,
      playerId: ball.wicket!.batsman,
      over: ball.over,
      ball: ball.ball,
      dismissal: {
        type: ball.wicket!.type,
        bowler: ball.wicket!.bowler,
        caughtBy: ball.wicket!.caughtBy,
        runOutBy: ball.wicket!.runOutBy,
        stumpedBy: ball.wicket!.stumpedBy,
        description: ball.wicket!.description,
      },
    }));
  }

  /**
   * Build commentary data from ball events
   */
  private buildCommentaryData(balls: BallDocument[]) {
    return balls.map((ball) => {
      let event = "DOT";
      let runs = 0;

      if (ball.eventType === "runs") {
        runs = ball.runs || 0;
        if (runs === 4) event = "FOUR";
        else if (runs === 6) event = "SIX";
        else if (runs > 0) event = `${runs} RUNS`;
      } else if (ball.eventType === "wicket") {
        event = "WICKET";
      } else if (ball.eventType === "extra") {
        event = ball.extras?.type?.toUpperCase() || "EXTRA";
        runs = ball.extras?.runs || 0;
      }

      return {
        ball: `${ball.over}.${ball.ball}`,
        innings: ball.innings,
        over: ball.over,
        ballNumber: ball.ball,
        batsmanId: ball.striker,
        bowlerId: ball.bowler,
        runs,
        event,
        comment: ball.commentary,
        extras: ball.extras
          ? {
              type: ball.extras.type,
              runs: ball.extras.runs,
              description: ball.extras.description,
            }
          : undefined,
        wicket: ball.wicket
          ? {
              type: ball.wicket.type,
              batsman: ball.wicket.batsman,
              bowler: ball.wicket.bowler,
              caughtBy: ball.wicket.caughtBy,
              runOutBy: ball.wicket.runOutBy,
              stumpedBy: ball.wicket.stumpedBy,
              description: ball.wicket.description,
            }
          : undefined,
        reviewed: ball.reviewed || false,
        reviewResult: ball.reviewResult,
        scoreState: ball.scoreState,
      };
    });
  }

  /**
   * Build match summary from match data
   */
  private buildMatchSummary(match: MatchDocument) {
    return {
      totalOvers: match.overs,
      matchType: match.matchType,
      venue: match.venue,
      tossWinner: match.tossWinner,
      tossDecision: match.tossDecision,
      result: match.result,
      manOfTheMatch: match.manOfTheMatch,
      umpires: match.umpires || [],
      thirdUmpire: match.thirdUmpire,
      matchReferee: match.matchReferee,
      weather: match.weather,
      pitchCondition: match.pitchCondition,
    };
  }

  /**
   * Get scorecard with real-time updates
   */
  async getLiveScorecard(matchId: string): Promise<ScorecardDocument> {
    const scorecard = await this.getScorecard(matchId);

    // Check if scorecard needs updating
    const lastBall = await this.ballModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .sort({ _id: -1 });

    if (lastBall && (lastBall as any).updatedAt > scorecard.lastUpdateTime) {
      // Update scorecard with latest data
      return this.updateScorecard(matchId);
    }

    return scorecard;
  }

  /**
   * Get scorecard for specific innings
   */
  async getInningsScorecard(
    matchId: string,
    inningsNumber: number
  ): Promise<any> {
    const scorecard = await this.getScorecard(matchId);
    const innings = scorecard.innings.find(
      (i) => i.inningNumber === inningsNumber
    );

    if (!innings) {
      throw new NotFoundException(`Innings ${inningsNumber} not found`);
    }

    return innings;
  }

  /**
   * Get player performance from scorecard
   */
  async getPlayerPerformance(matchId: string, playerId: string): Promise<any> {
    const scorecard = await this.getScorecard(matchId);

    const battingStats = scorecard.innings
      .flatMap((inning) => inning.batting)
      .find((batting) => batting.playerId.toString() === playerId);

    const bowlingStats = scorecard.innings
      .flatMap((inning) => inning.bowling)
      .find((bowling) => bowling.playerId.toString() === playerId);

    return {
      batting: battingStats,
      bowling: bowlingStats,
    };
  }

  /**
   * Get team comparison for a match
   */
  async getTeamComparison(matchId: string): Promise<any> {
    const scorecard = await this.getScorecard(matchId);

    const comparison = {
      matchId,
      teams: [],
      summary: {
        totalRuns: 0,
        totalWickets: 0,
        totalOvers: 0,
        runRate: 0,
        highestScore: 0,
        lowestScore: 0,
        bestBatting: null,
        bestBowling: null,
      },
    };

    // Process each innings
    scorecard.innings.forEach((inning) => {
      const teamData = {
        teamId: inning.teamId,
        teamName: (inning.teamId as any).name || "Unknown Team",
        inningsNumber: inning.inningNumber,
        runs: inning.runs,
        wickets: inning.wickets,
        overs: inning.overs,
        runRate:
          inning.overs > 0 ? (inning.runs / inning.overs).toFixed(2) : "0.00",
        extras: inning.extras || 0,
        batting: {
          totalRuns: inning.batting.reduce(
            (sum, player) => sum + player.runs,
            0
          ),
          totalBalls: inning.batting.reduce(
            (sum, player) => sum + player.balls,
            0
          ),
          totalFours: inning.batting.reduce(
            (sum, player) => sum + player.fours,
            0
          ),
          totalSixes: inning.batting.reduce(
            (sum, player) => sum + player.sixes,
            0
          ),
          topScorer: inning.batting.reduce(
            (max, player) => (player.runs > max.runs ? player : max),
            inning.batting[0]
          ),
        },
        bowling: {
          totalOvers: inning.bowling.reduce(
            (sum, player) => sum + player.overs,
            0
          ),
          totalMaidens: inning.bowling.reduce(
            (sum, player) => sum + player.maidens,
            0
          ),
          totalRunsConceded: inning.bowling.reduce(
            (sum, player) => sum + player.runsConceded,
            0
          ),
          totalWickets: inning.bowling.reduce(
            (sum, player) => sum + player.wickets,
            0
          ),
          bestBowler: inning.bowling.reduce(
            (max, player) => (player.wickets > max.wickets ? player : max),
            inning.bowling[0]
          ),
        },
        fallOfWickets: inning.fallOfWickets,
      };

      comparison.teams.push(teamData);
      comparison.summary.totalRuns += inning.runs;
      comparison.summary.totalWickets += inning.wickets;
      comparison.summary.totalOvers += inning.overs;

      // Track highest and lowest scores
      if (inning.runs > comparison.summary.highestScore) {
        comparison.summary.highestScore = inning.runs;
      }
      if (
        comparison.summary.lowestScore === 0 ||
        inning.runs < comparison.summary.lowestScore
      ) {
        comparison.summary.lowestScore = inning.runs;
      }
    });

    // Calculate overall run rate
    comparison.summary.runRate =
      comparison.summary.totalOvers > 0
        ? parseFloat(
            (
              comparison.summary.totalRuns / comparison.summary.totalOvers
            ).toFixed(2)
          )
        : 0.0;

    // Find best batting and bowling performances
    const allBatting = scorecard.innings.flatMap((inning) => inning.batting);
    const allBowling = scorecard.innings.flatMap((inning) => inning.bowling);

    if (allBatting.length > 0) {
      comparison.summary.bestBatting = allBatting.reduce(
        (max, player) => (player.runs > max.runs ? player : max),
        allBatting[0]
      );
    }

    if (allBowling.length > 0) {
      comparison.summary.bestBowling = allBowling.reduce(
        (max, player) => (player.wickets > max.wickets ? player : max),
        allBowling[0]
      );
    }

    return comparison;
  }

  /**
   * Get all scorecards for a tournament
   */
  async getTournamentScorecards(
    tournamentId: string
  ): Promise<ScorecardDocument[]> {
    const scorecards = await this.scorecardModel
      .find({ tournamentId: new Types.ObjectId(tournamentId) })
      .populate("matchId", "name venue startTime status teamAId teamBId")
      .populate("tournamentId", "name shortName")
      .populate("seriesId", "name shortName")
      .populate("innings.teamId", "name shortName")
      .populate("innings.batting.playerId", "fullName shortName")
      .populate("innings.bowling.playerId", "fullName shortName")
      .populate("matchSummary.tossWinner", "name shortName")
      .populate("matchSummary.manOfTheMatch", "fullName shortName")
      .sort({ matchNumber: 1, createdAt: 1 });

    if (!scorecards || scorecards.length === 0) {
      throw new NotFoundException("No scorecards found for this tournament");
    }

    return scorecards;
  }

  /**
   * Get all scorecards for a series
   */
  async getSeriesScorecards(seriesId: string): Promise<ScorecardDocument[]> {
    const scorecards = await this.scorecardModel
      .find({ seriesId: new Types.ObjectId(seriesId) })
      .populate("matchId", "name venue startTime status teamAId teamBId")
      .populate("tournamentId", "name shortName")
      .populate("seriesId", "name shortName")
      .populate("innings.teamId", "name shortName")
      .populate("innings.batting.playerId", "fullName shortName")
      .populate("innings.bowling.playerId", "fullName shortName")
      .populate("matchSummary.tossWinner", "name shortName")
      .populate("matchSummary.manOfTheMatch", "fullName shortName")
      .sort({ matchNumber: 1, createdAt: 1 });

    if (!scorecards || scorecards.length === 0) {
      throw new NotFoundException("No scorecards found for this series");
    }

    return scorecards;
  }
}
