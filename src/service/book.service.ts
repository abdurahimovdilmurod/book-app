import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { Book, BookModel } from "../model/book.model";
import { BaseService } from "./base.service";
import { BookDto, BookGetDto } from "../dto/book.dto";
import { Response } from "../common/types/response.type";

type Update = UpdateQuery<Book>;

class BookServise extends BaseService<Book> {
  constructor() {
    super(BookModel);
  }

  async save(dto: BookDto) {
    return await this.create(dto);
  }

  async update(id: string | Types.ObjectId, dto: Update | BookDto) {
    const book = await this.findById(id);

    if (book) {
      return await this.updateOne(id, dto);
    }

    throw Response.NotFound(id);
  }

  async setCoverImage(id: string | Types.ObjectId, coverImageURL: string) {
    const update: UpdateQuery<Book> = {
      $set: {
        coverImageURL,
      },
    };

    const book = await this.update(id, update);

    return book;
  }

  async pushImage(id: string | Types.ObjectId, image: string) {
    const update: UpdateQuery<Book> = {
      $push: {
        imageURLs: image,
      },
    };

    const book = await this.update(id, update);

    return book;
  }

  async getById(id: string | Types.ObjectId) {
    const query: FilterQuery<Book> = {
      isDeleted: false,
      _id: new Types.ObjectId(id),
    };

    const book = await this.findOne(query);

    if (!book) throw Response.NotFound(id);

    return book;
  }

  async getCountByCategory(dto: BookGetDto) {
    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
      },
    };

    const $skip: PipelineStage.Skip = {
      $skip: (dto.page - 1) * dto.limit,
    };

    const $limit: PipelineStage.Limit = {
      $limit: dto.limit,
    };

    const $group: PipelineStage.Group = {
      $group: {
        _id: "$categoryId",
        count: { $sum: 1 },
      },
    };
    const $lookup: PipelineStage.Lookup = {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    };
    const $unwind: PipelineStage.Unwind = {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    };

    const $project: PipelineStage.Project = {
      $project: { count: 1, name: "$category.name" },
    };

    const pipeline = [
      $match,
      $group,
      $lookup,
      $unwind,
      $project,
      $skip,
      $limit,
    ];

    const result = await this.aggregate(pipeline);
    return result;
  }

  async getPaging(dto: BookGetDto) {
    const query: FilterQuery<Book> = {
      isDeleted: false,
    };

    if (dto.authorId) query.authorId = new Types.ObjectId(dto.authorId);
    if (dto.categoryId) query.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.search) query.name = { $regex: dto.search, $options: "i" };

    const $lookupCategory: PipelineStage.Lookup = {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    };

    const $unwindCategory: PipelineStage.Unwind = {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    };

    const $lookupAuthor: PipelineStage.Lookup = {
      $lookup: {
        from: "authors",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    };

    const $unwindAuthor: PipelineStage.Unwind = {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    };

    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
        author: 1,
        pageCount: 1,
        isDeleted: 1,
        category: 1,
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
        coverImageURL: 1,
        imageURLs: 1,
      },
    };

    const pipeline = [
      $lookupCategory,
      $unwindCategory,
      $lookupAuthor,
      $unwindAuthor,
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

    const $lookupCategory: PipelineStage.Lookup = {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    };

    const $lookupAuthor: PipelineStage.Lookup = {
      $lookup: {
        from: "authors",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    };

    const $project: PipelineStage.Project = {
      $project: {
        _id: 1,
        name: 1,
        author: 1,
        pageCount: 1,
        isDeleted: 1,
        category: 1,
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
      $lookupCategory,
      $lookupAuthor,
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

export const bookService = new BookServise();
