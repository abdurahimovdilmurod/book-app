import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { Response } from "../types/response.type";
import { UserModel } from "../../model/user.model";

export function generateAccessToken(_id: string) {
  return jwt.sign({ _id }, String(process.env.JWT_SECRET), {
    expiresIn: "1d",
  });
}

export async function auth(req: any, res: any, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).send(Response.UnAuthorized(""));

  jwt.verify(
    token,
    String(process.env.JWT_SECRET),
    async (err: any, data: any) => {
      console.log(err);

      if (err) return res.sendStatus(403);

      const user = await UserModel.findById(data._id);

      req.user = user;

      next();
    }
  );
}
