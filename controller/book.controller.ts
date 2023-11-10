import { Router } from "express";
import { BookDto } from "../dto/book.dto";
import { validateIt } from "../common/validate";
import { Book } from "../model/book.model";
import { Types } from "mongoose";

export const bookRouter = Router();

async function parser(body: object): Promise<BookDto> {
  const dto = new BookDto();

  if (!body || typeof body !== "object")
    throw Error("Body undefined or is not an object");

  Object.keys(body).forEach((key) => {
    dto[key as keyof BookDto] = body[key as keyof object];
  });

  return dto;
}

bookRouter.get("/", async (req, res) => {
  const result = await Book.find({ isDeleted: false })
    .populate("categoryId")
    .sort("pageCount");
  return res.send(result);
});

bookRouter.get("/:id", async (req, res) => {
  const book = await Book.findOne({
    _id: new Types.ObjectId(req.params.id),
    isDeleted: false,
  }).populate("categoryId");
  if (!book) {
    return res.status(404).send("Bunday ID li kitob topilmadi");
  }
  return res.send(book);
});

bookRouter.post("/", async (req, res) => {
  try {
    const data = await parser(req.body);

    const result = await validateIt(data);

    await new Book(result).save();

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

bookRouter.put("/:id", async (req, res) => {
  try {
    const data = await parser(req.body);

    const result = await validateIt(data);

    const book = await Book.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id) },
      result,
      { new: true }
    );
    if (!book) {
      return res.status(404).send("Bunday ID li kitob topilmadi");
    }
    return res.send(book);
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
    return res.status(404).send("Bunday ID li kitob topilmadi");
  }
  book.isDeleted = true;
  await book.save();

  return res.send(book);
});
