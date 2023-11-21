import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { Response } from "../types/response.type";
import { UserModel } from "../../model/user.model";
import { Types } from "mongoose";

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
      if (err) return res.status(401).send(Response.UnAuthorized(""));

      const user = await UserModel.findOne({
        _id: new Types.ObjectId(data._id),
        isDeleted: false,
      });

      if (!user) return res.status(401).send(Response.UnAuthorized(""));

      req.user = user;

      next();
    }
  );
}

export async function authAdmin(req: any, res: any, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).send(Response.UnAuthorized(""));

  jwt.verify(
    token,
    String(process.env.JWT_SECRET),
    async (err: any, data: any) => {
      if (err) return res.status(401).send(Response.UnAuthorized(""));

      const user = await UserModel.findOne({
        _id: new Types.ObjectId(data._id),
        isDeleted: false,
      });

      if (!user) return res.status(401).send(Response.UnAuthorized(""));

      if (!user.isAdmin)
        return res.status(403).send(Response.NotEnoughPermission());

      req.user = user;

      next();
    }
  );
}
