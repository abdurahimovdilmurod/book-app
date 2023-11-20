import { Router } from "express";
import { validateIt } from "../common/validate";
import { AuthorDto, AuthorGetDto } from "../dto/author.dto";
import { BookGetDto } from "../dto/book.dto";
import { Response } from "../common/types/response.type";
import { auth } from "../common/middlware/auth.middleware";
import { authorService } from "../service/author.service";

export const authorRouter = Router();

authorRouter.get("/", async (req, res) => {
  try {
    const dto = await validateIt(req.query, BookGetDto);

    const data = await authorService.getPaging(dto);

    return res.send(Response.Success(data));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authorRouter.get("/:_id", async (req, res) => {
  try {
    const data = await validateIt(req.params, AuthorGetDto);

    const author = await authorService.getByIdAggregation(data._id);

    return res.send(Response.Success(author));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

authorRouter.post("/", auth, async (req, res) => {
  try {
    const dto = await validateIt(req.body, AuthorDto);

    dto.createdById = req.user._id;

    const author = await authorService.save(dto);

    const result = await authorService.getByIdAggregation(author._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

authorRouter.put("/:id", auth, async (req, res) => {
  try {
    const dto = await validateIt(req.body, AuthorDto);

    dto.updatedById = req.user._id;

    const updated = await authorService.update(req.params.id, dto);

    const result = await authorService.getByIdAggregation(updated._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

authorRouter.delete("/:id", auth, async (req, res) => {
  try {
    const result = await authorService.getByIdAggregation(req.params.id);

    await authorService.delete(req.params.id, req.user._id);

    return res.send(Response.Success(result));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});
