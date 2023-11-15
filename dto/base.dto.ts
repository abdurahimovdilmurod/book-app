import { IsMongoId } from "class-validator";

export class BaseDto {
  @IsMongoId()
  _id: string;
}
