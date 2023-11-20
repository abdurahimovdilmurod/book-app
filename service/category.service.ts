import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { CategoryDto } from "../dto/category.dto";
import { Category, CategoryModel } from "../model/category.model";
import { BaseService } from "./base.service";
import { Response } from "../common/types/response.type";
import { BookGetDto } from "../dto/book.dto";

type Update = UpdateQuery<Category>;

class CategoryService extends BaseService<Category> {
  constructor() {
    super(CategoryModel);
  }

  async save(dto: CategoryDto) {
    return await this.create(dto);
  }

  async getById(id: string | Types.ObjectId) {
    const query: FilterQuery<Category> = {
      isDeleted: false,
      _id: new Types.ObjectId(id),
    };

    const category = await this.findOne(query);

    if (!category) throw Response.NotFound(id);

    return category;
  }

  async update(id: string | Types.ObjectId, dto: Update | CategoryDto) {
    const category = await this.findById(id);

    if (category) {
      return await this.updateOne(id, dto);
    }

    throw Response.NotFound(id);
  }

  async getPaging(dto: BookGetDto) {
    const query: FilterQuery<Category> = {
      isDeleted: false,
    };
    if (dto.search) query.name = { $regex: dto.search, $options: "i" };

    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
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

  async getByIdWithAggregation(id: string | Types.ObjectId) {
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

    if (result.length) return result.shift();

    throw Response.NotFound(id);
  }
}
export const categoryService = new CategoryService();
