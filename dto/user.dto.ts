import {
  IsMongoId,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UserDto {
  @IsString({})
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNumber()
  age: number;
}

export class UserGetDto {
  @IsMongoId()
  _id: string;
}
