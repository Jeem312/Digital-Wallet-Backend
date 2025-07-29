import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { SendResponse } from "../../../utils/sendResponse";
import { WalletService } from "./wallet.service";

const getAllWallets = catchAsync(async (req:Request, res:Response) => {

const wallets = await WalletService.getAllWallets();

    SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "All wallets retrieved successfully",
        data: wallets
    })

})

const getWalletByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId.trim();
  const wallet = await WalletService.getWalletByUserId(userId);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User wallet fetched successfully",
    data: wallet
  });
});

const updateWalletBalance = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { amount } = req.body; 
  const updatedWallet = await WalletService.updateWalletBalance(userId, amount);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet balance updated successfully",
    data: updatedWallet
  });
});
const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.walletId;
  const { isBlocked } = req.body; 
  const wallet = await WalletService.setWalletBlockedStatus(walletId, isBlocked);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Wallet ${isBlocked ? "blocked" : "unblocked"} successfully`,
    data: wallet
  });
});
export const walletController = {
    getAllWallets,
    getWalletByUserId,
    updateWalletBalance,
    blockWallet
};