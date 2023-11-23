import { Router } from "express";
import { validateIt } from "../common/validate";
import {
  EmailAndOtpDto,
  EmailAndOtpPasswordDto,
  EmailDto,
  LoginDto,
  UserDto,
} from "../dto/user.dto";
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

    const user = await userService.getByEmailWithoutError(dto.email);

    if (user) {
      if (
        user.otpSentAt &&
        user.otpSentAt.getTime() - new Date().getTime() <=
          Number(process.env.OTP_TIMEOUT)
      )
        throw Response.OtpSentAtRecently(dto.email);

      throw Response.AlreadyExist(user);
    }

    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

    const hashedOtp = md5(otp.toString());

    dto.otp = hashedOtp;
    dto.otpSentAt = new Date();

    const new_user = await userService.save(dto);

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

    return res.send(
      Response.Success({ ...new_user.toObject(), password: "", otp: "" })
    );
  } catch (error) {
    if (error instanceof Response) res.status(400).send(error);
    else res.status(400).send(Response.UnKnownError());

    return;
  }
});

authRouter.post("/verify", async (req, res) => {
  try {
    const dto = await validateIt(req.body, EmailAndOtpDto);

    const user = await userService.getByEmail(dto.email);

    const sendOtpTime = new Date();
    if (user) {
      if (
        new Date(sendOtpTime).getTime() - user.otpSentAt.getTime() >
        Number(process.env.OTP_TIMEOUT)
      )
        throw Response.ExpiredOTP();
      const hashedOtp = md5(dto.otp.toString());

      if (user.otp === hashedOtp) await userService.setVerified(user._id, true);
      else throw Response.OTPNotMatch(dto.otp);
    } else throw Response.NotFound(dto.email);

    return res.send(Response.Success(user._id));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const dto = await validateIt(req.body, EmailDto);

    const user = await userService.getByEmailWithoutError(dto.email);

    if (!user) throw Response.NotFound(dto.email);

    if (
      user.otpSentAt &&
      new Date().getTime() - user.otpSentAt.getTime() <=
        Number(process.env.OTP_TIMEOUT)
    )
      throw Response.OtpSentAtRecently(dto.email);

    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

    const hashedOtp = md5(otp.toString());

    user.otp = hashedOtp;

    const result = await userService.setOTP(user._id, user.otp);

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

    return res.send(
      Response.Success({ ...result.toObject(), password: "", otp: "" })
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authRouter.post("/reset-password", async (req, res) => {
  try {
    const dto = await validateIt(req.body, EmailAndOtpPasswordDto);

    const user = await userService.getByEmail(dto.email);

    if (!user) throw Response.NotFound(dto.email);

    if (
      new Date().getTime() - user.otpSentAt.getTime() >
      Number(process.env.OTP_TIMEOUT)
    )
      throw Response.ExpiredOTP();

    const hashedOtp = md5(dto.otp.toString());

    if (user.otp !== hashedOtp) throw Response.OTPNotMatch(dto.otp);

    const hashedPassword = md5(dto.password);
    await userService.setPasswordAndRemoveOTP(user._id, hashedPassword);

    return res.send(Response.Success(user._id));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
