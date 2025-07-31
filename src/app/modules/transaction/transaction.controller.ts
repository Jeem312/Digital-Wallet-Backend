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

// const getTransactionById = catchAsync(async (req:Request, res:Response) => {
//   const { id } = req.params;
//   const result = await transactioService.getTransactionById(id);
 
//   SendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "All Transaction get successfully",
    
//   });
// });
export const transactionController = {
    getAllTransactions,
    // getTransactionById,
}