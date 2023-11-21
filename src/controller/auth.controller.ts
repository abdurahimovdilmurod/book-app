import { Router } from "express";
import { validateIt } from "../common/validate";
import { EmailDto, LoginDto, UserDto } from "../dto/user.dto";
import { UserModel } from "../model/user.model";
import md5 from "md5";
import { generateAccessToken } from "../common/middlware/auth.middleware";
import { Response } from "../common/types/response.type";
import nodemailer from "nodemailer";
import { userService } from "../service/user.service";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const dto = await validateIt(req.body, LoginDto);

    const user = await userService.getForLogin(dto);

    const token = generateAccessToken(user._id.toString());

    return res.send(
      Response.Success({ ...user.toObject(), token, password: "" })
    );
  } catch (e) {
    res.status(400).send(e);
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const dto = await validateIt(req.body, UserDto);

    const hashedPassword = md5(dto.password);

    dto.password = hashedPassword;

    await userService.checkEmailToExist(dto.email);

    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

    dto.otp = otp;

    const user = await userService.save(dto);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.GMAIL,
      to: dto.email,
      subject: "Ushbu code ni kiriting: ",
      text: otp.toString(),
    };

    await transporter.sendMail(mailOptions);

    return res.send(Response.Success({ ...user.toObject(), password: "" }));
  } catch (error) {
    if (error instanceof Response) res.status(400).send(error);
    else res.status(400).send(Response.UnKnownError());

    return;
  }
});

authRouter.post("/verify", async (req, res) => {
  try {
    const dto = await validateIt(req.body, EmailDto);
    const user = await userService.getByEmail(dto.email);

    if (user) {
      if (user.otp === dto.otp) await userService.setVerified(user._id, true);
      else throw Response.OTPNotMatch(dto.otp);
    } else throw Response.NotFound(dto.email);

    return res.send(Response.Success(user._id));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
