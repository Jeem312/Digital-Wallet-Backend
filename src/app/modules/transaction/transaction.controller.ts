import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { transactioService } from "./transaction.service";
import { SendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes"

 const getAllTransactions = catchAsync(async (req:Request, res:Response) => {
  const { data, meta } = await transactioService.getAllTransactions(req.query);
  
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Transaction get successfully",
    data,
    meta
  });
});

 const getTransactionById = catchAsync(async (req: Request, res: Response) => {
    const { role, id } = req.query;

 

    const transactions = await transactioService.getTransactionById(role as string, id as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  })

  const getAgentCommissionHistory = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.id;

  const result = await transactioService.getAgentCommissionHistory(agentId);

  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent commission history retrieved successfully",
    data: result,
  });
});

export const transactionController = {
    getAllTransactions,
    getTransactionById,
    getAgentCommissionHistory
}