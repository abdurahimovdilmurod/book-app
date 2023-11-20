import { Router } from "express";
import { validateIt } from "../common/validate";
import { LoginDto } from "../dto/user.dto";
import { UserModel } from "../model/user.model";
import md5 from "md5";
import { generateAccessToken } from "../common/middlware/auth.middleware";
import { Response } from "../common/types/response.type";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const dto = await validateIt(req.body, LoginDto);

    const hashedPassword = md5(dto.password);

    const user = await UserModel.findOne({
      isDeleted: false,
      email: dto.email,
      password: hashedPassword,
    });

    if (user) {
      const token = generateAccessToken(user._id.toString());
      res.status(200).send(
        Response.Success({
          ...user.toObject(),
          token,
          password: "",
        })
      );
    }
    res.status(400).send(Response.EmailOrPasswordIncorrect(dto.email));
  } catch (e) {
    res.status(400).send(e);
  }
});
