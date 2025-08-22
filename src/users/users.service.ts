import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationQueryDto } from "../common/dto/pagination.dto";
import { PaginationResponseDto } from "../common/dto/pagination.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const existingEmail = await this.findByEmail(createUserDto.email);
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = new this.userModel({
      ...createUserDto,
      passwordHash,
    });

    return user.save();
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<User>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find({ isActive: true })
        .select("-passwordHash")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments({ isActive: true }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByUsername(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if username or email already exists for other users
    if (updateUserDto.username) {
      const existingUser = await this.userModel.findOne({
        username: updateUserDto.username,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException("Username already exists");
      }
    }

    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException("Email already exists");
      }
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("User not found");
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException("User not found");
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { lastLoginAt: new Date() })
      .exec();
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    // Validate role
    const validRoles = ["ADMIN", "SCORER", "VIEWER"];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(
        "Invalid role. Must be one of: ADMIN, SCORER, VIEWER"
      );
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select("-passwordHash")
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
