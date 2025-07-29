/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import AppError from "../../../helpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { createUserTokens } from "../../../utils/userToken";
import { isActive } from "../user/user.interface";
import { Response } from "express";
import { envVars } from "../../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";

export const AuthService = {
  // ---------- LOGIN ----------
  loginUser: async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
    }

    if (user.isActive === isActive.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
    }

    const isPasswordMatched = await bcryptjs.compare(password, user.password || "");
    if (!isPasswordMatched) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const tokens = createUserTokens(user);
    const { password: pass, ...userData } = user.toObject();

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    };
  },

  // ---------- LOGOUT ----------
  logoutUser: async (res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return { message: "Logged out successfully" };
  },

  

};
