export enum ErrorCodes {
  SUCCESS = 0,
  VALIDATION_ERROR = -1,
  NOT_FOUND = -2,
  ALREADY_EXIST = -3,
  INCORRECT_EMAIL_PASSWORD = -4,
  UNAUTHORIZED = -5,
}

export class Response {
  constructor(
    public data: any,
    public code: number = ErrorCodes.SUCCESS,
    public message: string = "Success"
  ) {}

  public static Success(data: any) {
    return new Response(data);
  }
  public static ValidationError(data: any) {
    return new Response(data, ErrorCodes.VALIDATION_ERROR, "Validation Failed");
  }

  public static NotFound(data: any) {
    return new Response(data, ErrorCodes.NOT_FOUND, "Not Found");
  }

  public static EmailOrPasswordIncorrect(data: any) {
    return new Response(
      data,
      ErrorCodes.INCORRECT_EMAIL_PASSWORD,
      "Email or password is not correct"
    );
  }

  public static UnAuthorized(data: any) {
    return new Response(
      data,
      ErrorCodes.UNAUTHORIZED,
      "User is not authorized"
    );
  }
}
