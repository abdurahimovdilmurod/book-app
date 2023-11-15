import { Router } from "express";
import { CategoryDto, CategoryGetDto } from "../dto/category.dto";
import { validateIt } from "../common/validate";
import { Category } from "../model/category.model";
import { PipelineStage, Types } from "mongoose";
import { BookGetDto } from "../dto/book.dto";
import { Book } from "../model/book.model";
import { Response } from "../common/types/response.type";

export const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const dto = await validateIt(req.query, BookGetDto);
    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
      },
    };

    if (dto.search) $match.$match.name = { $regex: dto.search, $options: "i" };

    const $skip: PipelineStage.Skip = {
      $skip: (dto.page - 1) * dto.limit,
    };

    const $limit: PipelineStage.Limit = {
      $limit: dto.limit,
    };

    const data = await Category.aggregate([$match, $skip, $limit]);

    const total = await Category.countDocuments($match.$match);

    return res.send(Response.Success({ data, total }));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

categoryRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, CategoryGetDto);

    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
        _id: new Types.ObjectId(data._id),
      },
    };

    const category = (
      await Category.aggregate([
        $match,
        {
          $project: { _id: 1, name: 1 },
        },
      ])
    ).shift();

    const bookCount = await Book.countDocuments({
      isDeleted: false,
      categoryId: category._id,
    });

    category.bookCount = bookCount;
    return res.send(Response.Success(category));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

categoryRouter.post("/", async (req, res) => {
  try {
    const result = await validateIt(req.body, CategoryDto);
    await new Category(result).save();
    res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

categoryRouter.put("/:id", async (req, res) => {
  try {
    const result = await validateIt(req.body, CategoryDto);

    const category = await Category.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id), isDeleted: false },
      result,
      { new: true }
    );
    return res.send(Response.Success(category));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

categoryRouter.delete("/:id", async (req, res) => {
  const category = await Category.findOne({
    _id: new Types.ObjectId(req.params.id),
    isDeleted: false,
  });
  if (!category) {
    return res.send(Response.NotFound(req.params.id));
  }
  category.isDeleted = true;
  await category.save();
  return res.send(Response.Success(category));
});
