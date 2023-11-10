import {IsString, MaxLength, MinLength } from "class-validator";

export class CategoryDto {
    @IsString({})
    @MinLength(3)
    @MaxLength(200)
    name:string;
}