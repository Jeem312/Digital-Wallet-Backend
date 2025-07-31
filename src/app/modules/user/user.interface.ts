// src/app/modules/user/user.interface.ts

import { Types } from "mongoose";

export enum Role {
  USER = "user",
  AGENT = "agent",
  ADMIN = "admin",
  PENDING = "pending",
}

export enum isActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export enum AgentApprovalStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
    picture?: string; 
  phone?: string;
  address?: string; 
  role: Role;
  isActive?: string;
  status: isActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  agentApproval?: AgentApprovalStatus;
   wallet?: string | Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
