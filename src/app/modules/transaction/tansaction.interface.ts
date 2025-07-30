import { Types } from "mongoose";

export enum TransactionType {
  CASH_IN = "cash_in",
  CASH_OUT = "cash_out",
}

export interface ITransaction {
  amount: number;
  user: Types.ObjectId;
  agent: Types.ObjectId;
  type: TransactionType;
  charge: number;
  status: "success" | "failed";
}
