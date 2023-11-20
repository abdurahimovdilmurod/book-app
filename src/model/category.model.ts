import mongoose from "mongoose";
import { CollectionNames } from "../common/types/common.type";
import { BaseI, BaseSchema } from "./base.model";

export interface Category extends BaseI {
  name: string;
}

const CategorySchema = new mongoose.Schema<Category>({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 200,
    unique: true,
  },
}).add(BaseSchema);

export const CategoryModel = mongoose.model(
  CollectionNames.CATEGORIES,
  CategorySchema
);
