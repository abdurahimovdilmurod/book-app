import { Router } from "express";
import { validateIt } from "../common/validate";
import { UserDto, UserGetDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { Response } from "../common/types/response.type";
import { BookGetDto } from "../dto/book.dto";
import { PipelineStage, Types } from "mongoose";

export const userRouter = Router();

userRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, UserGetDto);

    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
        _id: new Types.ObjectId(data._id),
      },
    };

    const user = await User.aggregate([$match]);

    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const data = await validateIt(req.query, BookGetDto);
    const $match: PipelineStage.Match = {
      $match: {
        isDeleted: false,
      },
    };

    if (data.search)
      $match.$match.name = { $regax: data.search, $options: "i" };

    const $skip: PipelineStage.Skip = {
      $skip: (data.page - 1) * data.limit,
    };

    const $limit: PipelineStage.Limit = {
      $limit: data.limit,
    };

    const user = await User.aggregate([$match, $skip, $limit]);
    const total = await User.countDocuments();

    return res.send(Response.Success({ user, total }));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const user = await validateIt(req.body, UserDto);
    await new User(user).save();

    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const result = await validateIt(req.body, UserDto);
    const user = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id), isDeleted: false },
      result,
      { new: true }
    );
    if (!user) {
      return res.send(Response.NotFound(req.params.id));
    }
    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: new Types.ObjectId(req.params.id),
      isDeleted: false,
    });

    if (!user) {
      return res.send(Response.NotFound(req.params.id));
    }

    user.isDeleted = true;
    await user.save();

    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});
