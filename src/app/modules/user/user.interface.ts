import { Types } from "mongoose";

export enum Role {
  USER = "user",
  AGENT = "agent",
  ADMIN = "admin",
  PENDING = "pending", 
}

export enum AccountStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}
export enum isActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export enum AgentApprovalStatus {
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  picture?: string;
  role: Role;
  status: AccountStatus;
  isActive: isActive;
  isVerified: boolean;
  isDeleted: boolean;
 
  wallet?: Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}
