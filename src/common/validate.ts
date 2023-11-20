import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Response } from "./types/response.type";

type ErrorMessageType = {
  messages: {
    property: string;
    message: string;
  }[];
};

export const validateIt = async <T>(
  data: any,
  classType: ClassConstructor<T>
) => {
  const message: ErrorMessageType = { messages: [] };

  if (!data)
    throw message.messages.push({
      property: "",
      message: "Body is not an object",
    });

  const classData = plainToClass(classType, data as T, {
    excludeExtraneousValues: false,
  });
  const errors = await validate(classData as any, { whitelist: true });

  if (!errors || errors.length === 0) return classData;

  if (errors.length) {
    for (const error of errors) {
      if (error.property && error.constraints) {
        Object.keys(error.constraints).forEach((key) => {
          message.messages.push({
            property: error.property,
            message: error.constraints ? error.constraints[key] : "",
          });
        });
      }
    }
    throw Response.ValidationError(message);
  }

  return classData;
};
