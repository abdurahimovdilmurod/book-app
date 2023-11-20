import mongoose from "mongoose";
import { CollectionNames } from "../common/types/common.type";
import { BaseI, BaseSchema } from "./base.model";

export interface Author extends BaseI {
  name: string;
  dateOfBirth: Date;
  nationality: string;
}

const AuthorSchema = new mongoose.Schema<Author>({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 100,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  nationality: {
    type: String,
    minLength: 3,
    maxLength: 100,
  },
}).add(BaseSchema);

export const AuthorModel = mongoose.model(
  CollectionNames.AUTHORS,
  AuthorSchema
);
