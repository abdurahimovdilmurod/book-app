import {
  IsDateString,
  IsEmail,
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

  @IsEmail()
  email: string;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  password: string;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  confirmPassword: string;

  @IsDateString()
  dateOfBirth: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString({})
  @MinLength(8)
  @MaxLength(200)
  password: string;
}

export class UserGetDto {
  @IsMongoId()
  _id: string;
}
