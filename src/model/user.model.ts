import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";
import { BaseI, BaseSchema } from "./base.model";

export interface User extends BaseI {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  otp: number;
  isVerified: boolean;
  dateOfBirth?: Date;
  isAdmin: boolean | any;
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
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  otp: {
    type: Number,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  dateOfBirth: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}).add(BaseSchema);

export const UserModel = mongoose.model(CollectionNames.USERS, UserSchema);
