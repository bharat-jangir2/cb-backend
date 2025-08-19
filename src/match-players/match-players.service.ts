import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatchPlayer, MatchPlayerDocument } from './schemas/match-player.schema';
import { CreateMatchPlayerDto } from './dto/create-match-player.dto';
import { UpdateMatchPlayerDto } from './dto/update-match-player.dto';

@Injectable()
export class MatchPlayersService {
  constructor(
    @InjectModel(MatchPlayer.name) private matchPlayerModel: Model<MatchPlayerDocument>,
  ) {}

  async create(matchId: string, createMatchPlayerDto: CreateMatchPlayerDto): Promise<MatchPlayer> {
    // Check if player is already assigned to this match
    const existingPlayer = await this.matchPlayerModel.findOne({
      matchId: new Types.ObjectId(matchId),
      playerId: new Types.ObjectId(createMatchPlayerDto.playerId),
      isActive: true,
    });

    if (existingPlayer) {
      throw new ConflictException('Player is already assigned to this match');
    }

    // Check if captain/vice-captain already exists for the team in this match
    if (createMatchPlayerDto.isCaptain) {
      const existingCaptain = await this.matchPlayerModel.findOne({
        matchId: new Types.ObjectId(matchId),
        teamId: new Types.ObjectId(createMatchPlayerDto.teamId),
        isCaptain: true,
        isActive: true,
      });

      if (existingCaptain) {
        throw new ConflictException('Team already has a captain in this match');
      }
    }

    if (createMatchPlayerDto.isViceCaptain) {
      const existingViceCaptain = await this.matchPlayerModel.findOne({
        matchId: new Types.ObjectId(matchId),
        teamId: new Types.ObjectId(createMatchPlayerDto.teamId),
        isViceCaptain: true,
        isActive: true,
      });

      if (existingViceCaptain) {
        throw new ConflictException('Team already has a vice-captain in this match');
      }
    }

    const matchPlayer = new this.matchPlayerModel({
      ...createMatchPlayerDto,
      matchId: new Types.ObjectId(matchId),
      playerId: new Types.ObjectId(createMatchPlayerDto.playerId),
      teamId: new Types.ObjectId(createMatchPlayerDto.teamId),
    });

    return matchPlayer.save();
  }

  async findAllByMatch(matchId: string): Promise<MatchPlayer[]> {
    return this.matchPlayerModel
      .find({ matchId: new Types.ObjectId(matchId), isActive: true })
      .populate('playerId', 'fullName shortName role photoUrl')
      .populate('teamId', 'name shortName')
      .sort({ battingOrder: 1 })
      .exec();
  }

  async findByMatchAndTeam(matchId: string, teamId: string): Promise<MatchPlayer[]> {
    return this.matchPlayerModel
      .find({ 
        matchId: new Types.ObjectId(matchId), 
        teamId: new Types.ObjectId(teamId),
        isActive: true 
      })
      .populate('playerId', 'fullName shortName role photoUrl')
      .populate('teamId', 'name shortName')
      .sort({ battingOrder: 1 })
      .exec();
  }

  async findById(id: string): Promise<MatchPlayer> {
    const matchPlayer = await this.matchPlayerModel
      .findById(id)
      .populate('playerId', 'fullName shortName role photoUrl')
      .populate('teamId', 'name shortName')
      .populate('matchId', 'name venue startTime')
      .exec();

    if (!matchPlayer) {
      throw new NotFoundException('Match player not found');
    }
    return matchPlayer;
  }

  async update(id: string, updateMatchPlayerDto: UpdateMatchPlayerDto): Promise<MatchPlayer> {
    const matchPlayer = await this.matchPlayerModel.findById(id).exec();
    if (!matchPlayer) {
      throw new NotFoundException('Match player not found');
    }

    // Check if captain/vice-captain already exists for the team in this match
    if (updateMatchPlayerDto.isCaptain) {
      const existingCaptain = await this.matchPlayerModel.findOne({
        matchId: matchPlayer.matchId,
        teamId: matchPlayer.teamId,
        isCaptain: true,
        isActive: true,
        _id: { $ne: id },
      });

      if (existingCaptain) {
        throw new ConflictException('Team already has a captain in this match');
      }
    }

    if (updateMatchPlayerDto.isViceCaptain) {
      const existingViceCaptain = await this.matchPlayerModel.findOne({
        matchId: matchPlayer.matchId,
        teamId: matchPlayer.teamId,
        isViceCaptain: true,
        isActive: true,
        _id: { $ne: id },
      });

      if (existingViceCaptain) {
        throw new ConflictException('Team already has a vice-captain in this match');
      }
    }

    const updatedMatchPlayer = await this.matchPlayerModel
      .findByIdAndUpdate(id, updateMatchPlayerDto, { new: true })
      .populate('playerId', 'fullName shortName role photoUrl')
      .populate('teamId', 'name shortName')
      .exec();

    return updatedMatchPlayer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.matchPlayerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Match player not found');
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.matchPlayerModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    
    if (!result) {
      throw new NotFoundException('Match player not found');
    }
  }

  async updateMatchStats(id: string, stats: any): Promise<MatchPlayer> {
    const matchPlayer = await this.matchPlayerModel
      .findByIdAndUpdate(
        id,
        { $set: { matchStats: stats } },
        { new: true }
      )
      .populate('playerId', 'fullName shortName role photoUrl')
      .populate('teamId', 'name shortName')
      .exec();

    if (!matchPlayer) {
      throw new NotFoundException('Match player not found');
    }

    return matchPlayer;
  }
} 