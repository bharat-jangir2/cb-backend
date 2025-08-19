import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Ball, BallDocument } from "./schemas/ball.schema";
import { CreateBallDto } from "./dto/create-ball.dto";
import { MatchesService } from "../matches/matches.service";
import { MatchPlayersService } from "../match-players/match-players.service";

@Injectable()
export class BallsService {
  constructor(
    @InjectModel(Ball.name) private ballModel: Model<BallDocument>,
    private matchesService: MatchesService,
    private matchPlayersService: MatchPlayersService
  ) {}

  async create(matchId: string, createBallDto: CreateBallDto): Promise<Ball> {
    // Validate match exists
    const match = await this.matchesService.findById(matchId);

    // Build event object based on event type
    const event: any = {
      type: createBallDto.eventType,
      description: createBallDto.description,
    };

    switch (createBallDto.eventType) {
      case "runs":
        if (!createBallDto.runs && createBallDto.runs !== 0) {
          throw new BadRequestException("Runs are required for runs event");
        }
        event.runs = createBallDto.runs;
        break;

      case "extra":
        if (!createBallDto.extras) {
          throw new BadRequestException(
            "Extra details are required for extra event"
          );
        }
        event.extras = createBallDto.extras;
        break;

      case "wicket":
        if (!createBallDto.wicket) {
          throw new BadRequestException(
            "Wicket details are required for wicket event"
          );
        }
        event.wicket = createBallDto.wicket;
        break;

      case "over_change":
        if (!createBallDto.overChange) {
          throw new BadRequestException(
            "Over change details are required for over change event"
          );
        }
        event.overChange = createBallDto.overChange;
        break;

      case "innings_change":
        if (!createBallDto.inningsChange) {
          throw new BadRequestException(
            "Innings change details are required for innings change event"
          );
        }
        event.inningsChange = createBallDto.inningsChange;
        break;
    }

    // Create ball record
    const ball = new this.ballModel({
      matchId: new Types.ObjectId(matchId),
      innings: createBallDto.innings,
      over: createBallDto.over,
      ball: createBallDto.ball,
      event,
      commentary: createBallDto.commentary,
    });

    // Calculate and store score state
    const scoreState = await this.calculateScoreState(matchId, createBallDto);
    ball.scoreState = scoreState;

    const savedBall = await ball.save();

    // Update match with current state
    await this.updateMatchState(matchId, scoreState);

    return savedBall;
  }

  async findAllByMatch(matchId: string): Promise<Ball[]> {
    return this.ballModel
      .find({ matchId: new Types.ObjectId(matchId) })
      .sort({ innings: 1, over: 1, ball: 1 })
      .exec();
  }

  async findById(id: string): Promise<Ball> {
    const ball = await this.ballModel.findById(id).exec();
    if (!ball) {
      throw new NotFoundException("Ball not found");
    }
    return ball;
  }

  async findLastBall(matchId: string): Promise<BallDocument | null> {
    return this.ballModel
      .findOne({ matchId: new Types.ObjectId(matchId) })
      .sort({ innings: -1, over: -1, ball: -1 })
      .exec();
  }

  async undoLastBall(matchId: string): Promise<Ball> {
    const lastBall = await this.findLastBall(matchId);
    if (!lastBall) {
      throw new NotFoundException("No balls found to undo");
    }

    // Remove the last ball
    await this.ballModel.findByIdAndDelete(lastBall._id);

    // Recalculate score state
    const newLastBall = await this.findLastBall(matchId);
    if (newLastBall) {
      const scoreState = await this.calculateScoreState(matchId, {
        innings: newLastBall.innings,
        over: newLastBall.over,
        ball: newLastBall.ball,
        eventType: newLastBall.event.type as any,
      });

      await this.updateMatchState(matchId, scoreState);
    } else {
      // No more balls, reset match state
      await this.resetMatchState(matchId);
    }

    return lastBall;
  }

  async undoSpecificBall(matchId: string, ballId: string): Promise<Ball> {
    const ball = await this.findById(ballId);

    // Check if this is the last ball
    const lastBall = await this.findLastBall(matchId);
    const lastBallId = lastBall?._id?.toString();
    if (lastBallId !== ballId) {
      throw new BadRequestException("Can only undo the last ball");
    }

    return this.undoLastBall(matchId);
  }

  private async calculateScoreState(
    matchId: string,
    ballData: any
  ): Promise<any> {
    // Get all balls for this match
    const balls = await this.findAllByMatch(matchId);

    // Initialize score state
    let scoreState = {
      teamARuns: 0,
      teamAWickets: 0,
      teamAOvers: 0,
      teamBRuns: 0,
      teamBWickets: 0,
      teamBOvers: 0,
      currentInnings: ballData.innings,
      currentOver: ballData.over,
      currentBall: ballData.ball,
    };

    // Calculate score from all balls
    for (const ball of balls) {
      if (ball.event.type === "runs") {
        if (ball.innings === 1) {
          scoreState.teamARuns += ball.event.runs || 0;
        } else {
          scoreState.teamBRuns += ball.event.runs || 0;
        }
      } else if (ball.event.type === "extra") {
        if (ball.innings === 1) {
          scoreState.teamARuns += ball.event.extras?.runs || 0;
        } else {
          scoreState.teamBRuns += ball.event.extras?.runs || 0;
        }
      } else if (ball.event.type === "wicket") {
        if (ball.innings === 1) {
          scoreState.teamAWickets += 1;
        } else {
          scoreState.teamBWickets += 1;
        }
      }
    }

    // Calculate overs
    if (ballData.innings === 1) {
      scoreState.teamAOvers = ballData.over + ballData.ball / 6;
    } else {
      scoreState.teamBOvers = ballData.over + ballData.ball / 6;
    }

    return scoreState;
  }

  private async updateMatchState(
    matchId: string,
    scoreState: any
  ): Promise<void> {
    await this.matchesService.update(matchId, {
      currentInnings: scoreState.currentInnings,
      currentOver: scoreState.currentOver,
      currentBall: scoreState.currentBall,
      score: {
        teamA: {
          runs: scoreState.teamARuns,
          wickets: scoreState.teamAWickets,
          overs: scoreState.teamAOvers,
        },
        teamB: {
          runs: scoreState.teamBRuns,
          wickets: scoreState.teamBWickets,
          overs: scoreState.teamBOvers,
        },
      },
    });
  }

  private async resetMatchState(matchId: string): Promise<void> {
    await this.matchesService.update(matchId, {
      currentInnings: 1,
      currentOver: 0,
      currentBall: 0,
      score: {
        teamA: { runs: 0, wickets: 0, overs: 0 },
        teamB: { runs: 0, wickets: 0, overs: 0 },
      },
    });
  }
}
