import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Player, PlayerDocument } from "./schemas/player.schema";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { PaginationQueryDto } from "../common/dto/pagination.dto";
import { PaginationResponseDto } from "../common/dto/pagination.dto";

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // Check if player already exists
    const existingPlayer = await this.findByFullName(createPlayerDto.fullName);
    if (existingPlayer) {
      throw new ConflictException("Player with this name already exists");
    }

    const player = new this.playerModel(createPlayerDto);
    return player.save();
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Player>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "fullName",
      sortOrder = "asc",
      search,
      nationality,
      role,
      status,
      battingStyle,
      bowlingStyle,
    } = paginationQuery;
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: any = { isActive: true };

    // Add search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { fullName: searchRegex },
        { shortName: searchRegex },
        { nationality: searchRegex },
        { role: searchRegex },
        { battingStyle: searchRegex },
        { bowlingStyle: searchRegex },
      ];
    }

    // Add filter functionality
    if (nationality && nationality.trim()) {
      filter.nationality = new RegExp(nationality.trim(), "i");
    }

    if (role && role.trim()) {
      filter.role = new RegExp(role.trim(), "i");
    }

    if (status && status.trim()) {
      filter.status = new RegExp(status.trim(), "i");
    }

    if (battingStyle && battingStyle.trim()) {
      filter.battingStyle = new RegExp(battingStyle.trim(), "i");
    }

    if (bowlingStyle && bowlingStyle.trim()) {
      filter.bowlingStyle = new RegExp(bowlingStyle.trim(), "i");
    }

    // Build sort object
    const sortObject: any = {};
    if (sortBy) {
      sortObject[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const [players, total] = await Promise.all([
      this.playerModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortObject)
        .exec(),
      this.playerModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: players,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException("Player not found");
    }
    return player;
  }

  async findByFullName(fullName: string): Promise<Player | null> {
    return this.playerModel.findOne({ fullName }).exec();
  }

  async findByRole(role: string): Promise<Player[]> {
    return this.playerModel.find({ role, isActive: true }).exec();
  }

  async findByNationality(nationality: string): Promise<Player[]> {
    return this.playerModel.find({ nationality, isActive: true }).exec();
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    // For now, return all active players since team relationship is not implemented
    // This can be enhanced when team-player relationship is added to the schema
    return this.playerModel.find({ isActive: true }).exec();
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    // Check if name already exists for other players
    if (updatePlayerDto.fullName) {
      const existingPlayer = await this.playerModel.findOne({
        fullName: updatePlayerDto.fullName,
        _id: { $ne: id },
      });
      if (existingPlayer) {
        throw new ConflictException("Player with this name already exists");
      }
    }

    const player = await this.playerModel
      .findByIdAndUpdate(id, updatePlayerDto, { new: true })
      .exec();

    if (!player) {
      throw new NotFoundException("Player not found");
    }

    return player;
  }

  async remove(id: string): Promise<void> {
    const result = await this.playerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Player not found");
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.playerModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException("Player not found");
    }
  }

  async updateLastMatchDate(id: string): Promise<void> {
    await this.playerModel
      .findByIdAndUpdate(id, { lastMatchDate: new Date() })
      .exec();
  }

  async getPlayerStats(
    playerId: string,
    format?: string,
    period?: string
  ): Promise<any> {
    const player = await this.findById(playerId);
    if (!player) {
      throw new NotFoundException("Player not found");
    }

    // This is a placeholder implementation
    // In a real application, you would aggregate data from match statistics
    const stats = {
      playerId: (player as any)._id || (player as any).id,
      playerName: player.fullName,
      format: format || "all",
      period: period || "career",
      batting: {
        matches: 0,
        innings: 0,
        runs: 0,
        highestScore: 0,
        average: 0,
        strikeRate: 0,
        fifties: 0,
        hundreds: 0,
        fours: 0,
        sixes: 0,
      },
      bowling: {
        matches: 0,
        innings: 0,
        overs: 0,
        wickets: 0,
        bestBowling: "0/0",
        average: 0,
        economy: 0,
        strikeRate: 0,
        fourWickets: 0,
        fiveWickets: 0,
      },
      fielding: {
        catches: 0,
        stumpings: 0,
        runOuts: 0,
      },
    };

    // TODO: Implement actual statistics aggregation from match data
    // This would involve querying the match statistics collection
    // and aggregating data based on format and period filters

    return stats;
  }
}
