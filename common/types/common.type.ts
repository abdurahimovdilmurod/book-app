import { Request } from "express";
import { User } from "../../model/user.model";

export enum CollectionNames {
  AUTHORS = "authors",
  BOOKS = "books",
  CATEGORIES = "categories",
  USERS = "users",
}

export interface CustomRequest extends Request<{}> {
  user: User;
}
