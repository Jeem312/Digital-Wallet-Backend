import { JwtPayload } from "jsonwebtoken";
import { isActive, IUser } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";
import { envVars } from "../config/envConfig";
import AppError from "../helpers/AppError";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes"

export const createUserTokens = (user:Partial<IUser>)=>{
    const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }
        const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

        const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_SECRET_EXPIRED)

        return {
            accessToken,
            refreshToken
        }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);

  
  if (typeof verifiedToken !== 'object' || !('email' in verifiedToken)) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const { email } = verifiedToken as JwtPayload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User Not Exist');
  }

  if (
    isUserExist.isActive === isActive.BLOCKED ||
    isUserExist.isActive === isActive.INACTIVE
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is Blocked/Inactive');
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User deleted');
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};
