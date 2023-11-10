import { validate } from "class-validator";

type ErrorMessageType  = {
    statusCode:number;
    messages: {
        property:string;
        message:string;
    }[]
}

export async function validateIt<T>(dto:T):Promise<T>{
    const errors = await validate(dto as object);

    const message:ErrorMessageType = {statusCode:400,messages:[]};

    if(errors.length) {
        for(const error of errors) {
            if(error.property &&  error.constraints) {
                Object.keys(error.constraints).forEach(key=> {
                    message.messages.push({
                        property: error.property,
                        message:error.constraints ? error.constraints[key] : ""
                    })
                })
            }
        }
        throw message;
    }

    return dto;
}