import AppError from "../../../helpers/AppError";
import { AgentApproval, IUser, Role, AccountStatus } from "./user.interface";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../../config/envConfig";
import { Wallet } from "../wallet/wallet.model";

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
        userData.agentApproval = AgentApproval.PENDING;
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



export const UserService = {
    createNewUser
}