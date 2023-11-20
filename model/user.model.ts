import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";
import { BaseI, BaseSchema } from "./base.model";

export interface User extends BaseI {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  dateOfBirth?: Date;
}

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  //dateOfBirth kerakmas o'rniga dateofBirth qo'shish kerak
  dateOfBirth: {
    type: Date,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}).add(BaseSchema);

export const UserModel = mongoose.model(CollectionNames.USERS, UserSchema);
