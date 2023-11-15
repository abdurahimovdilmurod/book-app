import { Router } from "express";
import { Author } from "../model/author.model";
import { PipelineStage, Types } from "mongoose";
import { validateIt } from "../common/validate";
import { AuthorDto, AuthorGetDto } from "../dto/author.dto";
import { BookGetDto } from "../dto/book.dto";
import { Book } from "../model/book.model";
import { Response } from "../common/types/response.type";

export const authorRouter = Router();

authorRouter.get("/", async (req, res) => {
  try {
    const data = await validateIt(req.query, BookGetDto);
    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
      },
    };

    if (data.search)
      $match.$match.name = { $regex: data.search, $options: "i" };

    const $skip: PipelineStage.Skip = {
      $skip: (data.page - 1) * data.limit,
    };
    const $limit: PipelineStage.Limit = {
      $limit: data.limit,
    };

    const author = await Author.aggregate([$match, $skip, $limit]);
    const total = await Author.countDocuments();

    return res.send(Response.Success({ author, total }));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authorRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, AuthorGetDto);

    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
        _id: new Types.ObjectId(data._id),
      },
    };

    const author = (
      await Author.aggregate([
        $match,
        {
          $project: { _id: 1, name: 1, age: 1, nationality: 1 },
        },
      ])
    ).shift();

    const bookCount = await Book.countDocuments({
      isDeleted: false,
      authorId: author._id,
    });

    author.bookCount = bookCount;
    return res.send(Response.Success(author));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

authorRouter.post("/", async (req, res) => {
  try {
    const result = await validateIt(req.body, AuthorDto);
    await new Author(result).save();
    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

authorRouter.put("/:id", async (req, res) => {
  try {
    const result = await validateIt(req.body, AuthorDto);

    const author = await Author.findOneAndUpdate(
      {
        _id: new Types.ObjectId(req.params.id),
        isDeleted: false,
      },
      result,
      { new: true }
    );

    return res.send(Response.Success(author));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

authorRouter.delete("/:id", async (req, res) => {
  const author = await Author.findOne({
    _id: new Types.ObjectId(req.params.id),
    isDeleted: false,
  });

  if (!author) {
    return res.send(Response.NotFound(req.params.id));
  }
  author.isDeleted = true;
  await author.save();

  return res.send(Response.Success(author));
});
