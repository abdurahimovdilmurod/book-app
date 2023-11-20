import { Router } from "express";
import { validateIt } from "../common/validate";
import { UserDto, UserGetDto } from "../dto/user.dto";
import { UserModel } from "../model/user.model";
import { Response } from "../common/types/response.type";
import { BookGetDto } from "../dto/book.dto";
import { PipelineStage, Types } from "mongoose";
import md5 from "md5";

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

    const user = await UserModel.aggregate([$match]);

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

    const $project: PipelineStage.Project = {
      $project: {
        password: 0,
      },
    };

    const user = await UserModel.aggregate([$match, $skip, $limit, $project]);
    const total = await UserModel.countDocuments();

    return res.send(Response.Success({ user, total }));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const dto = await validateIt(req.body, UserDto);

    dto.password = md5(dto.password);

    const user = await new UserModel(dto).save();

    if (user.password) delete user.password;

    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const result = await validateIt(req.body, UserDto);
    const user = await UserModel.findOneAndUpdate(
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
    const user = await UserModel.findOne({
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
