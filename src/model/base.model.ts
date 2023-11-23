import mongoose, { Types } from "mongoose";
import { CollectionNames } from "../common/types/common.type";

export interface BaseI {
  createdById?: Types.ObjectId;
  updatedById?: Types.ObjectId;
  deletedById?: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export const BaseSchema = new mongoose.Schema(
  {
    createdById: {
      type: Types.ObjectId,
      ref: CollectionNames.USERS,
    },
    updatedById: {
      type: Types.ObjectId,
      ref: CollectionNames.USERS,
    },
    deletedById: {
      type: Types.ObjectId,
      ref: CollectionNames.USERS,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
