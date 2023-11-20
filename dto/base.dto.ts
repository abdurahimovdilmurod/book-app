import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class BaseDto {
  createdById?: Types.ObjectId;
  updatedById?: Types.ObjectId;
}

export class GetByIdDto {
  @IsMongoId()
  _id: string;
}
