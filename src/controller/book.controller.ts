import { Router } from "express";
import { BookDto, BookGetDto } from "../dto/book.dto";
import { validateIt } from "../common/validate";
import { GetByIdDto } from "../dto/base.dto";
import { Response } from "../common/types/response.type";
import { auth } from "../common/middlware/auth.middleware";
import { bookService } from "../service/book.service";
import { categoryService } from "../service/category.service";
import { authorService } from "../service/author.service";

export const bookRouter = Router();

bookRouter.get("/count", async (req, res) => {
  try {
    const dto = await validateIt(req.query, BookGetDto);

    const data = await bookService.getCountByCategory(dto);

    return res.send(Response.Success(data));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.get("/", async (req: any, res) => {
  try {
    const dto = await validateIt(req.query, BookGetDto);

    const data = await bookService.getPaging(dto);

    return res.send(Response.Success(data));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, GetByIdDto);

    const book = await bookService.getByIdAggregation(data._id);

    return res.send(Response.Success(book));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.post("/", auth, async (req, res) => {
  try {
    const dto = await validateIt(req.body, BookDto);

    dto.createdById = req.user._id;

    if (dto.categoryId) await categoryService.getById(dto.categoryId);

    if (dto.authorId) await authorService.getById(dto.authorId);

    const book = await bookService.save(dto);

    const result = await bookService.getByIdAggregation(book._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.put("/:id", auth, async (req, res) => {
  try {
    const dto = await validateIt(req.body, BookDto);

    dto.updatedById = req.user._id;

    const updated = await bookService.update(req.params.id, dto);

    const result = await bookService.getByIdAggregation(updated._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.delete("/:id", async (req, res) => {
  try {
    const result = await bookService.getByIdAggregation(req.params.id);

    await bookService.delete(req.params.id, req.user._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});
