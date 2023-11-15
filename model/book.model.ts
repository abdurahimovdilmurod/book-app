import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";

const BookSchema = new mongoose.Schema({
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
  createdBy: {
    type: Types.ObjectId,
    ref: CollectionNames.USERS,
  },
  updatedBy: {
    type: Types.ObjectId,
    ref: CollectionNames.USERS,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Book = mongoose.model(CollectionNames.BOOKS, BookSchema);
