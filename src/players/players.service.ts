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
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [players, total] = await Promise.all([
      this.playerModel
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ fullName: 1 })
        .exec(),
      this.playerModel.countDocuments({ isActive: true }),
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
}
