import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 100,
  },
  age: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    minLength: 3,
    maxLength: 100,
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

export const Author = mongoose.model(CollectionNames.AUTHORS, AuthorSchema);
