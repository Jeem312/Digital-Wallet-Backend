/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../../utils/catchAsync";
import { SendResponse } from "../../../utils/sendResponse";
import { setAuthCookie } from "../../../utils/setCookie";
import { AuthService } from "./auth.service";
import httStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
const loginUser = catchAsync(async (req: Request, res: Response) => {



    const {email,password} = req.body;

  const { user, accessToken, refreshToken } = await AuthService.loginUser(email, password);

 
    setAuthCookie(res, { accessToken, refreshToken });

    SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
        }
    })
})


const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.cookies;

    await AuthService.logoutUser(token);

  

    SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
        data: null
    })
})



export const authController = {
    loginUser,
    logoutUser,
    
};