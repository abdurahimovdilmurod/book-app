import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { BaseDto } from "./base.dto";

export class AuthorDto extends BaseDto {
  @IsString({})
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString({})
  @MinLength(3)
  @MaxLength(100)
  nationality: string;
}

export class AuthorGetDto {
  @IsMongoId()
  _id: string;
}
