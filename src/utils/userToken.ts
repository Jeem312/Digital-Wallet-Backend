// import { envConfig } from "../config/env";
// import AppError from "../errorHelpers/AppError";
// import { isActive, IUser } from "../modules/user/user.interface";
// import User from "../modules/user/user.models";
// import { generateToken, verifyToken } from "./jwt";
// import httpStatus from "http-status-codes"

// export const createUserTokens = (user:Partial<IUser>)=>{
//     const jwtPayload = {
//             userId: user._id,
//             email: user.email,
//             role: user.role
//         }
//         const accessToken = generateToken(jwtPayload,envConfig.JWT_ACCESS_SECRET,envConfig.JWT_ACCESS_EXPIRES)
    
//         const refreshToken = generateToken(jwtPayload,envConfig.JWT_REFRESH_SECRET,envConfig.JWT_REFRESH_SECRET_EXPIRED)

//         return {
//             accessToken,
//             refreshToken
//         }
// }

// export const createNewAccessTokenWithRefreshToken=async(refreshToken:string)=>{
 

// const verifiedToken = verifyToken(refreshToken,envConfig.JWT_REFRESH_SECRET);

//   const isUserExist = await User.findOne(({email:verifiedToken.email}))




      

//     if(!isUserExist){
//         throw new AppError(httpStatus.BAD_REQUEST,'User Not Exist')
//     }

//     if (isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE) {

//                 throw new AppError(httpStatus.BAD_REQUEST,'User is Blocked/Inactive')
//     }
//     if (isUserExist.isDeleted) {
//                 throw new AppError(httpStatus.BAD_REQUEST,'User deleted')
        
//     }
   

//        const jwtPayload = {
//             userId: isUserExist._id,
//             email: isUserExist.email,
//             role: isUserExist.role
//         }
//         const accessToken = generateToken(jwtPayload,envConfig.JWT_ACCESS_SECRET,envConfig.JWT_REFRESH_SECRET_EXPIRED)

        
//  return{
//    accessToken:accessToken,

//  }

// }