import { Router } from "express";
import { validateIt } from "../common/validate";
import { Response } from "../common/types/response.type";
import { auth } from "../common/middlware/auth.middleware";
import { categoryService } from "../service/category.service";
import { BookGetDto } from "../dto/book.dto";
import { CategoryDto, CategoryGetDto } from "../dto/category.dto";

export const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const dto = await validateIt(req.query, BookGetDto);

    const data = await categoryService.getPaging(dto);

    return res.send(Response.Success(data));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

categoryRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, CategoryGetDto);

    const category = await categoryService.getByIdWithAggregation(data._id);

    return res.send(Response.Success(category));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

categoryRouter.post("/", auth, async (req, res) => {
  try {
    const dto = await validateIt(req.body, CategoryDto);

    dto.createdById = req.user._id;

    const category = await categoryService.save(dto);

    const result = await categoryService.getByIdWithAggregation(category._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

categoryRouter.put("/:id", auth, async (req, res) => {
  try {
    const dto = await validateIt(req.body, CategoryDto);

    dto.updatedById = req.user._id;

    const updated = await categoryService.update(req.params.id, dto);

    const result = await categoryService.getByIdWithAggregation(updated._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

categoryRouter.delete("/:id", auth, async (req, res) => {
  try {
    const result = await categoryService.getByIdWithAggregation(req.params.id);

    await categoryService.delete(req.params.id, req.user._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
