import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { SendResponse } from "../../../utils/sendResponse";
import { WalletService } from "./wallet.service";
import httpStatus from "http-status-codes";
const getAllWallets = catchAsync(async (req:Request, res:Response) => {

const wallets = await WalletService.getAllWallets();

    SendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "All wallets retrieved successfully",
        data: wallets
    })

})

const getWalletByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId.trim();
  const wallet = await WalletService.getWalletByUserId(userId);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User wallet fetched successfully",
    data: wallet
  });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const { userId, agentId } = req.query as { userId: string; agentId: string };
  const { amount } = req.body;

  const result = await WalletService.cashIn(userId, agentId, amount);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash-in successful",
    data: result,
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
  const { userId, agentId } = req.query as { userId: string; agentId: string };
  const { amount } = req.body;

  const result = await WalletService.cashOut(userId, agentId, amount);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash-out successful",
    data: result,
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
    cashIn,
    cashOut,
    blockWallet
};