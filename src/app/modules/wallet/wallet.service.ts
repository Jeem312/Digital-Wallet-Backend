import AppError from "../../../helpers/AppError";
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
  const updateWalletBalance = async (userId: string, amount: number) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Wallet is blocked");
    }
    if (wallet.balance + amount < 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }
    wallet.balance += amount;
    await wallet.save();
    return wallet;
  }

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
    updateWalletBalance,
    setWalletBlockedStatus
};