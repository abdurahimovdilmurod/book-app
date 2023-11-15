import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class AuthorDto {
  @IsString({})
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNumber()
  age: number;

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
