import AppError from "../../../helpers/AppError";
import {  IUser, Role, isActive, AgentApprovalStatus } from "./user.interface";
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
        status: isActive.ACTIVE,
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

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query)
    .filter()
    .search(["email", "name"]) 
    .sort()
    .paginate();

  const data = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data, meta };
};


const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};


const updateUser = async (userId: string, updateData: Partial<IUser>) => {
  if (updateData && "role" in updateData) {
    delete updateData.role;  
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};
const updateUserRole = async (userId: string, newRole: Role) => {
  
  if (!Object.values(Role).includes(newRole)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }


  return updatedUser;
};

const updateAccountStatus = async (id: string, status?: string) => {
  if (!status || typeof status !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, "Status is required and must be a string");
  }

  const normalizedStatus = status.trim().toLowerCase() as isActive;

  if (!Object.values(isActive).includes(normalizedStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid account status");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: normalizedStatus },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

const updateAgentApprovalStatus = async (
  userId: string,
  approvalStatus: AgentApprovalStatus
) => {
  if (!Object.values(AgentApprovalStatus).includes(approvalStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid approval status");
  }

  let newRole = Role.USER;
  if (approvalStatus === AgentApprovalStatus.ACCEPTED) {
    newRole = Role.AGENT;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      agentApproval: approvalStatus,
      role: newRole,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

export const UserService = {
    createNewUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserRole,
    updateAccountStatus,
    updateAgentApprovalStatus
}