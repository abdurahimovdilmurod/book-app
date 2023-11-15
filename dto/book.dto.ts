import { Transform } from "class-transformer";
import {
  MinLength,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
  IsMongoId,
} from "class-validator";

export class BookDto {
  @IsString({})
  @MinLength(3)
  name: string;

  @IsString({})
  @MinLength(2)
  author: string;

  @IsOptional()
  @IsString({})
  @MinLength(10)
  @MaxLength(600)
  description: string;

  @IsNumber()
  pageCount: number;

  @IsOptional()
  @IsString()
  publishedAt: string;

  @IsOptional()
  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsMongoId()
  authorId: string;
}

export class BookGetDto {
  @IsOptional()
  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsMongoId()
  authorId: string;

  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  page: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  search: string;
}
