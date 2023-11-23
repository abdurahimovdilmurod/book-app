import { User, UserModel } from "../model/user.model";
import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { BaseService } from "./base.service";
import { LoginDto, UserDto } from "../dto/user.dto";
import { Response } from "../common/types/response.type";
import { BookGetDto } from "../dto/book.dto";
import md5 from "md5";

type Update = UpdateQuery<User>;

class UserService extends BaseService<User> {
  constructor() {
    super(UserModel);
  }

  async save(dto: UserDto) {
    return await this.create(dto);
  }

  async getForLogin(dto: LoginDto) {
    const hashedPassword = md5(dto.password);

    const user = await this.findOne({
      isDeleted: false,
      isVerified: true,
      email: dto.email,
      password: hashedPassword,
    });

    if (user) {
      return user;
    }

    throw Response.EmailOrPasswordIncorrect(dto.email);
  }

  async checkEmailToExist(email: string) {
    const user = await this.findOne({ email: email });

    if (user) throw Response.AlreadyExist(user);

    return user;
  }

  // async checkEmailToExist2(email: string) {
  //   const user = await this.findOne({ email: email });

  //   if (!user) throw Response.NotRegistered(user);

  //   return user;
  // }

  async getByEmailWithoutError(email: string) {
    const user = await this.findOne({ email: email });

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.findOne({ email: email });

    if (!user) throw Response.NotFound(user);

    return user;
  }

  async getById(id: string | Types.ObjectId) {
    const query: FilterQuery<User> = {
      isDeleted: false,
      _id: new Types.ObjectId(id),
    };

    const user = await this.findOne(query);

    if (!user) throw Response.NotFound(id);

    return user;
  }

  async update(id: string | Types.ObjectId, dto: Update | UserDto) {
    const user = await this.findById(id);

    if (user) {
      return await this.updateOne(id, dto);
    }

    throw Response.NotFound(id);
  }

  async setVerified(id: Types.ObjectId, isVerified: boolean) {
    const update: UpdateQuery<User> = {
      $set: {
        isVerified,
      },
    };
    if (isVerified) {
      update.$unset = {
        otp: "",
      };
    }

    return await this.updateOne(id, update);
  }

  async setOTP(id: Types.ObjectId, otp: string) {
    const update: UpdateQuery<User> = {
      $set: {
        otp: otp,
        otpSentAt: new Date(),
      },
    };

    return await this.updateOne(id, update);
  }

  async setPasswordAndRemoveOTP(id: Types.ObjectId, password: string) {
    const update: UpdateQuery<User> = {
      $set: {
        password: password,
      },
      $unset: {
        otp: "",
      },
    };
    return await this.updateOne(id, update);
  }

  async getPaging(dto: BookGetDto) {
    const query: FilterQuery<User> = {
      isDeleted: false,
    };

    if (dto.search) query.name = { $regex: dto.search, $options: "i" };

    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
        dateOfBirth: 1,
        isDeleted: 1,
        isAdmin: 1,
        createdBy: {
          _id: 1,
          name: 1,
        },
        updatedBy: {
          _id: 1,
          name: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    };

    const pipeline = [
      this.$lookupCreatedBy,
      this.$unwindCreatedBy,
      this.$lookupUpdatedBy,
      this.$unwindUpdateBy,
      $project,
    ];

    const result = await this.findPaging(query, pipeline, dto);

    return result;
  }

  async getByIdAggregation(id: string | Types.ObjectId) {
    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
        _id: new Types.ObjectId(id),
      },
    };

    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
        dateOfBirth: 1,
        isDeleted: 1,
        isAdmin: 1,
        createdBy: {
          _id: 1,
          name: 1,
        },
        updatedBy: {
          _id: 1,
          name: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    };

    const pipeline = [
      $match,
      this.$lookupCreatedBy,
      this.$unwindCreatedBy,
      this.$lookupUpdatedBy,
      this.$unwindUpdateBy,
      $project,
    ];

    const result = await this.aggregate(pipeline);
    if (result.length) {
      return result.shift();
    }
    throw Response.NotFound(id);
  }
}

export const userService = new UserService();
