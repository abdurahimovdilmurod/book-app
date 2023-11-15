import mongoose from "mongoose";
import { CollectionNames } from "../common/types/common.type";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 100,
  },
  //age kerakmas o'rniga dateofBirth qo'shish kerak
  age: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model(CollectionNames.USERS, UserSchema);
