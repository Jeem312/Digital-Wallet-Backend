import { Types } from "mongoose";

export interface IWallet {
  _id?: Types.ObjectId;
  user: Types.ObjectId; 
  balance: number;
  currency: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
