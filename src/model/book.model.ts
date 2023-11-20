import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";
import { BaseI, BaseSchema } from "./base.model";

export interface Book extends BaseI {
  name: string;
  description: string;
  pageCount: number;
  publishedAt: string;
  categoryId: Types.ObjectId | any;
  authorId: Types.ObjectId | any;
  coverImageURL: string | any;
  imageURLs: Array<String> | any;
}

const BookSchema = new mongoose.Schema<Book>({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  description: {
    type: String,
    minLength: 10,
    maxLength: 600,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  publishedAt: {
    type: String,
  },
  categoryId: {
    type: Types.ObjectId,
    ref: CollectionNames.CATEGORIES,
  },
  authorId: {
    type: Types.ObjectId,
    ref: CollectionNames.AUTHORS,
  },
  coverImageURL: {
    type: String,
  },
  imageURLs: {
    type: [String],
    default: [],
  },
}).add(BaseSchema);

export const BookModel = mongoose.model(CollectionNames.BOOKS, BookSchema);
