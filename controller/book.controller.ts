import { Router } from "express";
import { BookDto, BookGetDto } from "../dto/book.dto";
import { validateIt } from "../common/validate";
import { Book } from "../model/book.model";
import { PipelineStage, Types } from "mongoose";
import { Category } from "../model/category.model";
import { Author } from "../model/author.model";
import { BaseDto } from "../dto/base.dto";
import { Response } from "../common/types/response.type";

export const bookRouter = Router();

//Har bir kategoriyadagi kitoblar sonini topish
bookRouter.get("/count", async (req, res) => {
  try {
    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
      },
    };

    //$match ni to'g'irlash kerak
    //$group da _id null beriladi agar hammasi bitta qilaman desayiz
    const result = await Book.aggregate([
      $match,
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: { count: 1, name: "$category.name" },
      },
    ]);
    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.get("/", async (req, res) => {
  try {
    const data = await validateIt(req.query, BookGetDto);

    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
      },
    };

    if (data.authorId)
      $match.$match.authorId = new Types.ObjectId(data.authorId);
    if (data.categoryId)
      $match.$match.categoryId = new Types.ObjectId(data.categoryId);
    if (data.search)
      $match.$match.name = { $regex: data.search, $options: "i" };

    const $skip: PipelineStage.Skip = {
      $skip: (data.page - 1) * data.limit,
    };

    const $limit: PipelineStage.Limit = {
      $limit: data.limit,
    };

    const result = await Book.aggregate([
      $match,
      $skip,
      $limit,
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          author: 1,
          pageCount: 1,
          isDeleted: 1,
          category: 1,
        },
      },
    ]);

    const total = await Book.countDocuments($match.$match);

    return res.send(Response.Success({ data: result, total }));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//Id si bo'yicha kitobni topish
bookRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, BaseDto);

    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
        _id: new Types.ObjectId(data._id),
      },
    };

    const book = await Book.aggregate([
      $match,
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
    ]);
    return res.send(Response.Success(book));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.post("/", async (req, res) => {
  try {
    const result = await validateIt(req.body, BookDto);

    if (result.categoryId) {
      const category = await Category.findOne({
        _id: new Types.ObjectId(result.categoryId),
        isDeleted: false,
      });
      if (!category) throw Response.NotFound(result.categoryId);
    }

    if (result.authorId) {
      const author = await Author.findOne({
        _id: new Types.ObjectId(result.authorId),
        isDeleted: false,
      });
      if (!author) throw Response.NotFound(result.authorId);
    }

    await new Book(result).save();

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.put("/:id", async (req, res) => {
  try {
    const result = await validateIt(req.body, BookDto);

    const book = await Book.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id) },
      result,
      { new: true }
    );
    if (!book) {
      return res.send(Response.NotFound(req.params.id));
    }
    return res.send(Response.Success(book));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.delete("/:id", async (req, res) => {
  const book = await Book.findOne({
    _id: new Types.ObjectId(req.params.id),
    isDeleted: false,
  });

  if (!book) {
    return res.send(Response.NotFound(req.params.id));
  }
  book.isDeleted = true;
  await book.save();

  return res.send(Response.Success(book));
});
