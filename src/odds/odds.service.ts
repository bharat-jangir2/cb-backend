import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Odds, OddsDocument } from "./schemas/odds.schema";
import { CreateOddsDto } from "./dto/create-odds.dto";
import { MatchesService } from "../matches/matches.service";

@Injectable()
export class OddsService {
  constructor(
    @InjectModel(Odds.name) private oddsModel: Model<OddsDocument>,
    private matchesService: MatchesService
  ) {}

  async create(matchId: string, createOddsDto: CreateOddsDto): Promise<Odds> {
    // Validate match exists
    await this.matchesService.findById(matchId);

    // Validate probabilities sum to 1 (approximately)
    let totalProbability =
      createOddsDto.teamA.probability + createOddsDto.teamB.probability;
    if (createOddsDto.draw) totalProbability += createOddsDto.draw.probability;
    if (createOddsDto.tie) totalProbability += createOddsDto.tie.probability;

    if (Math.abs(totalProbability - 1) > 0.1) {
      throw new BadRequestException(
        "Probabilities must sum to approximately 1"
      );
    }

    const odds = new this.oddsModel({
      matchId: new Types.ObjectId(matchId),
      ...createOddsDto,
    });

    return odds.save();
  }

  async findAllByMatch(matchId: string): Promise<Odds[]> {
    return this.oddsModel
      .find({ matchId: new Types.ObjectId(matchId), isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findLatestByMatch(matchId: string): Promise<Odds | null> {
    return this.oddsModel
      .findOne({ matchId: new Types.ObjectId(matchId), isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Odds> {
    const odds = await this.oddsModel.findById(id).exec();
    if (!odds) {
      throw new NotFoundException("Odds not found");
    }
    return odds;
  }

  async calculateAIOdds(matchId: string): Promise<CreateOddsDto> {
    // Get match details
    const match = await this.matchesService.findById(matchId);

    // Get current score state
    const matchState = await this.matchesService.getMatchState(matchId);

    // Simple AI algorithm to calculate odds based on current match state
    // In a real application, this would be much more sophisticated
    let teamAProbability = 0.5;
    let teamBProbability = 0.5;

    if (matchState.score) {
      const { teamA, teamB } = matchState.score;

      // Calculate run rate and required run rate
      const teamARunRate = teamA.overs > 0 ? teamA.runs / teamA.overs : 0;
      const teamBRunRate = teamB.overs > 0 ? teamB.runs / teamB.overs : 0;

      // Calculate remaining resources
      const teamAOversRemaining = (match.overs || 50) - teamA.overs;
      const teamBOversRemaining = (match.overs || 50) - teamB.overs;
      const teamAWicketsRemaining = 10 - teamA.wickets;
      const teamBWicketsRemaining = 10 - teamB.wickets;

      // Simple probability calculation based on current state
      if (matchState.currentInnings === 1) {
        // First innings - probability based on current run rate and remaining resources
        const teamAPotential =
          teamARunRate * teamAOversRemaining * (teamAWicketsRemaining / 10);
        const teamBPotential =
          6 * teamBOversRemaining * (teamBWicketsRemaining / 10); // Assume 6 runs per over

        const totalPotential = teamAPotential + teamBPotential;
        teamAProbability =
          totalPotential > 0 ? teamAPotential / totalPotential : 0.5;
        teamBProbability = 1 - teamAProbability;
      } else {
        // Second innings - probability based on target and current state
        const target = teamA.runs + 1;
        const currentScore = teamB.runs;
        const oversRemaining = teamBOversRemaining;
        const wicketsRemaining = teamBWicketsRemaining;

        const requiredRunRate =
          oversRemaining > 0 ? (target - currentScore) / oversRemaining : 0;
        const currentRunRate = teamB.overs > 0 ? teamB.runs / teamB.overs : 0;

        if (requiredRunRate <= currentRunRate && wicketsRemaining >= 5) {
          teamBProbability = 0.7; // Team B likely to win
          teamAProbability = 0.3;
        } else if (
          requiredRunRate > currentRunRate * 1.5 ||
          wicketsRemaining <= 3
        ) {
          teamAProbability = 0.7; // Team A likely to win
          teamBProbability = 0.3;
        } else {
          // Close match
          teamAProbability = 0.5;
          teamBProbability = 0.5;
        }
      }
    }

    // Convert probabilities to odds (decimal format)
    const teamAOdds = teamAProbability > 0 ? 1 / teamAProbability : 1000;
    const teamBOdds = teamBProbability > 0 ? 1 / teamBProbability : 1000;

    return {
      teamA: {
        odds: Math.round(teamAOdds * 100) / 100,
        probability: Math.round(teamAProbability * 1000) / 1000,
        description: "AI calculated odds",
      },
      teamB: {
        odds: Math.round(teamBOdds * 100) / 100,
        probability: Math.round(teamBProbability * 1000) / 1000,
        description: "AI calculated odds",
      },
      source: "ai_agent",
      confidence: 0.7, // Medium confidence for simple algorithm
      notes: "AI calculated odds based on current match state",
      live: matchState.score
        ? {
            currentScore: {
              teamARuns: matchState.score.teamA?.runs || 0,
              teamAWickets: matchState.score.teamA?.wickets || 0,
              teamAOvers: matchState.score.teamA?.overs || 0,
              teamBRuns: matchState.score.teamB?.runs || 0,
              teamBWickets: matchState.score.teamB?.wickets || 0,
              teamBOvers: matchState.score.teamB?.overs || 0,
            },
          }
        : undefined,
    };
  }

  async updateAIOdds(matchId: string): Promise<Odds> {
    const aiOdds = await this.calculateAIOdds(matchId);
    return this.create(matchId, aiOdds);
  }

  async remove(id: string): Promise<void> {
    const result = await this.oddsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Odds not found");
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.oddsModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException("Odds not found");
    }
  }
}
