import { IsMongoId, IsString, MaxLength, MinLength } from "class-validator";
import { BaseDto } from "./base.dto";

export class CategoryDto extends BaseDto {
  @IsString({})
  @MinLength(3)
  @MaxLength(200)
  name: string;
}
export class CategoryGetDto {
  @IsMongoId()
  _id: string;
}
