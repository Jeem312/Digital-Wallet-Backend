import mongoose from "mongoose";
import AppError from "../../../helpers/AppError";
import { TransactionType } from "../transaction/tansaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";


const getAllWallets = async() => {

     const wallets = await Wallet.find()
      .populate("user", "name email role");
    return wallets;
}
 const getWalletByUserId = async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    return wallet;
  }

const CHARGE_PERCENTAGE = 5;

const cashIn = async (userId: string, agentId: string, amount: number) => {
    const userWallet = await Wallet.findOne({ user: userId });
    const agentWallet = await Wallet.findOne({ user: agentId });
    if (!userWallet || !agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "User or agent wallet not found");
    }

    if (!userId || !agentId) {
        throw new AppError(httpStatus.BAD_REQUEST, "User ID and Agent ID are required");
    }
    
    if (userId === agentId) {
        throw new AppError(httpStatus.BAD_REQUEST, "User and Agent cannot be the same");
    }
    
    if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Amount must be a positive number");
    }

    // Calculate amounts
    const charge = (amount * CHARGE_PERCENTAGE) / 100;
    const finalAmount = amount - charge;

    // Start transaction
    const session = await Wallet.startSession();
    session.startTransaction();
    
    try {
        const userWallet = await Wallet.findOne({ user: userId })
        const agentWallet = await Wallet.findOne({ user: agentId })

        if (!userWallet) {
            throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
        }
        if (!agentWallet) {
            throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
        }

        // Check if wallets are blocked
        if (userWallet.isBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, "User wallet is blocked");
        }
        if (agentWallet.isBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, "Agent wallet is blocked");
        }

        // Update balances
        userWallet.balance += finalAmount;
        agentWallet.balance += charge;

        await userWallet.save({ session });
        await agentWallet.save({ session });

        // Create transaction record
        await Transaction.create([{
            type: TransactionType.CASH_IN,
            amount,
            charge,
            user: userId,
            agent: agentId,
            userWalletBalance: userWallet.balance,
            agentWalletBalance: agentWallet.balance
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return { 
            userBalance: userWallet.balance, 
            agentBalance: agentWallet.balance 
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};



const cashOut = async (userId: string, agentId: string, amount: number) => {
  const charge = (amount * CHARGE_PERCENTAGE) / 100;
  const totalDeduction = amount + charge;

  const userWallet = await Wallet.findOne({ user: userId });
  const agentWallet = await Wallet.findOne({ user: agentId });

  if (!userWallet || !agentWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User or agent wallet not found");
  }

  if (userWallet.balance < totalDeduction) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  userWallet.balance -= totalDeduction;
  agentWallet.balance += charge;

  await userWallet.save();
  await agentWallet.save();

  // Save transaction
  await Transaction.create({
    type: TransactionType.CASH_OUT,
    amount,
    charge,
    user: userId,
    agent: agentId,
  });

  return { userBalance: userWallet.balance, agentBalance: agentWallet.balance };
};

  const setWalletBlockedStatus = async (walletId: string, blocked: boolean) => {
    const wallet = await Wallet.findById({ _id: walletId });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
   wallet.isBlocked = blocked ? true : false;
    await wallet.save();
    return wallet;
  }

export const WalletService = {
    getAllWallets,
    getWalletByUserId,
    cashIn,
    cashOut,
    setWalletBlockedStatus
};