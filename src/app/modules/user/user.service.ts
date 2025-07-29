import AppError from "../../../helpers/AppError";
import {  IUser, Role, AccountStatus } from "./user.interface";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../../config/envConfig";
import { Wallet } from "../wallet/wallet.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";

const createNewUser = async (payload: Partial<IUser> )=>{

const {email , password , ...rest} = payload;

    const isUserExists = await User.findOne({
        email
    })

    if(isUserExists){
        throw new AppError(httpStatus.BAD_REQUEST,'User Already Exist');
    }

    const  passwordHash = await bcrypt.hash(password as string,envVars.BCRYPT_SALT_ROUND);

    const userData: Partial<IUser> = {
        ...rest,
        email,
        password: passwordHash,
        role: payload.role || Role.USER, 
        status: AccountStatus.ACTIVE,
        isVerified: false,
        isDeleted: false,
    };
    if (payload.role === Role.AGENT) {
        userData.role = Role.PENDING; 
    }
    const user = await User.create(userData);



     // Create wallet
  const wallet = await Wallet.create({
    user: user._id,
    balance: 50,
  });

    user.wallet = wallet._id;
  await user.save();
  
    return user;
}

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};


const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};



export const UserService = {
    createNewUser,
    getAllUsers,
    getSingleUser
}