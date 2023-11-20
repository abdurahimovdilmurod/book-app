import { UserModel } from "../../../model/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}
