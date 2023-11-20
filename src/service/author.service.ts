import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { Author, AuthorModel } from "../model/author.model";
import { BaseService } from "./base.service";
import { AuthorDto } from "../dto/author.dto";
import { Response } from "../common/types/response.type";
import { BookGetDto } from "../dto/book.dto";

type Update = UpdateQuery<Author>;

class AuthorService extends BaseService<Author> {
  constructor() {
    super(AuthorModel);
  }

  async save(dto: AuthorDto) {
    return await this.create(dto);
  }

  async getById(id: string | Types.ObjectId) {
    const query: FilterQuery<Author> = {
      isDeleted: false,
      _id: new Types.ObjectId(id),
    };

    const author = await this.findOne(query);

    if (!author) throw Response.NotFound(id);

    return author;
  }

  async update(id: string | Types.ObjectId, dto: Update | AuthorDto) {
    const author = await this.findById(id);

    if (author) {
      return await this.updateOne(id, dto);
    }

    throw Response.NotFound(id);
  }

  async getPaging(dto: BookGetDto) {
    const query: FilterQuery<Author> = {
      isDeleted: false,
    };

    if (dto.search) query.name = { $regex: dto.search, $options: "i" };

    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
        dataOfBirth: 1,
        nationality: 1,
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
        _id: new Types.ObjectId(id),
        isDeleted: false,
      },
    };
    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
        dataOfBirth: 1,
        nationality: 1,
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

export const authorService = new AuthorService();
