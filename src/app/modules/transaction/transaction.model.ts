import { Schema, model } from "mongoose";
import { ITransaction, TransactionType } from "./tansaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,   
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    charge: {
      type: Number,
      required: true,
      default: 0         
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
