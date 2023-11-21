import { Document, FilterQuery, Model, PipelineStage, Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";
import { Response } from "../common/types/response.type";

export class BaseService<T> {
  protected $lookupCreatedBy: PipelineStage.Lookup = {
    $lookup: {
      from: CollectionNames.USERS,
      localField: "createdById",
      foreignField: "_id",
      as: "createdBy",
    },
  };

  protected $unwindCreatedBy: PipelineStage.Unwind = {
    $unwind: {
      path: "$createdBy",
      preserveNullAndEmptyArrays: true,
    },
  };

  protected $lookupUpdatedBy: PipelineStage.Lookup = {
    $lookup: {
      from: CollectionNames.USERS,
      localField: "updatedById",
      foreignField: "_id",
      as: "updatedBy",
    },
  };

  protected $unwindUpdateBy: PipelineStage.Unwind = {
    $unwind: {
      path: "$updatedBy",
      preserveNullAndEmptyArrays: true,
    },
  };

  constructor(public model: typeof Model<T>) {}

  protected async create(data: any): Promise<T & Document> {
    const docs = await this.model.create([data]);

    const result = await this.model.findById(docs[0]._id);

    return result;
  }

  protected async updateOne(id: string | Types.ObjectId, data: any) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string | Types.ObjectId, deletedById: Types.ObjectId) {
    const doc = await this.model.findById(id);

    if (doc) {
      return await this.updateOne(id, {
        $set: { isDeleted: true, deletedById, deletedAt: new Date() },
      });
    }

    throw Response.NotFound(id);
  }

  protected async findById(id: string | Types.ObjectId) {
    return await this.model.findById(id.toString());
  }

  protected async findOne(
    query: FilterQuery<T>
  ): Promise<(T & Document) | null> {
    return await this.model.findOne(query);
  }

  protected async findPaging(
    query: FilterQuery<T>,
    pipeline: PipelineStage[],
    dto: { page: number; limit: number }
  ) {
    const $skip: PipelineStage.Skip = {
      $skip: (dto.page - 1) * dto.limit,
    };

    const $limit: PipelineStage.Limit = {
      $limit: dto.limit,
    };

    pipeline = [{ $match: query }, $skip, $limit, ...pipeline];

    const total = await this.countTotal(query);

    const data = await this.model.aggregate(pipeline);

    return { data, total };
  }

  protected async countTotal(query: FilterQuery<T>) {
    return await this.model.countDocuments(query);
  }

  protected async aggregate(pipeline: PipelineStage[]) {
    return await this.model.aggregate(pipeline);
  }
}
