import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  isNumber,
} from "class-validator";
import { BaseDto } from "./base.dto";

export class UserDto extends BaseDto {
  @IsString({})
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  password: string;

  @IsOptional()
  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  confirmPassword: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: string;

  otp: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  password: string;
}

export class EmailDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}
export class UserGetDto {
  @IsMongoId()
  _id: string;
}
