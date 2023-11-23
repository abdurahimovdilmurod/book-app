import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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

  otp: string;
  otpSentAt: Date;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  password: string;
}

export class EmailAndOtpDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}

export class EmailAndOtpPasswordDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  password: string;
}

export class EmailDto {
  @IsEmail()
  email: string;
}
export class UserGetDto {
  @IsMongoId()
  _id: string;
}
