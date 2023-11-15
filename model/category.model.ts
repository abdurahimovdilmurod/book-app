import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 200,
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

export const Category = mongoose.model(
  CollectionNames.CATEGORIES,
  CategorySchema
);
