export enum ErrorCodes {
  SUCCESS = 0,
  VALIDATION_ERROR = -1,
  NOT_FOUND = -2,
  ALREADY_EXIST = -3,
  INCORRECT_EMAIL_PASSWORD = -4,
  UNAUTHORIZED = -5,
  NOT_ENOUGH_PERMISSION = -6,
  OTP_NOT_MATCH = -7,
  UNKNOWN_ERROR = -8,
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

  public static OTPNotMatch(data: any) {
    return new Response(
      data,
      ErrorCodes.OTP_NOT_MATCH,
      "Verification code is not valid"
    );
  }

  public static AlreadyExist(data: any) {
    return new Response(data, ErrorCodes.ALREADY_EXIST, "Already exist");
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

  public static NotEnoughPermission() {
    return new Response(
      "",
      ErrorCodes.NOT_ENOUGH_PERMISSION,
      "Not enough permission"
    );
  }

  public static UnKnownError() {
    return new Response("", ErrorCodes.UNKNOWN_ERROR, "Unknown error");
  }
}
