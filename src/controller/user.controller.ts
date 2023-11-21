import { Router } from "express";
import { validateIt } from "../common/validate";
import { UserDto, UserGetDto } from "../dto/user.dto";
import { Response } from "../common/types/response.type";
import { BookGetDto } from "../dto/book.dto";
import md5 from "md5";
import { authAdmin } from "../common/middlware/auth.middleware";
import { userService } from "../service/user.service";

export const userRouter = Router();

userRouter.get("/:_id", authAdmin, async (req, res) => {
  try {
    const dto = await validateIt(req.params, UserGetDto);

    const user = await userService.getByIdAggregation(dto._id);

    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.get("/", authAdmin, async (req, res) => {
  try {
    const dto = await validateIt(req.query, BookGetDto);

    const data = await userService.getPaging(dto);

    return res.send(Response.Success(data));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.post("/", authAdmin, async (req, res) => {
  try {
    const dto = await validateIt(req.body, UserDto);

    dto.createdById = req.user._id;

    dto.password = md5(dto.password);

    const user = await userService.save(dto);

    const result = await userService.getByIdAggregation(user._id);

    if (result.password) delete result.password;

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.put("/:id", authAdmin, async (req, res) => {
  try {
    const dto = await validateIt(req.body, UserDto);

    dto.updatedById = req.user._id;

    const user = await userService.save(dto);

    const result = await userService.getByIdAggregation(user._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

userRouter.delete("/:id", authAdmin, async (req, res) => {
  try {
    const result = await userService.getById(req.params.id);

    const user = await userService.delete(result.id, req.user.id);

    return res.send(Response.Success(user));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});
