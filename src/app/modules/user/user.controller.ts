import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { SendResponse } from "../../../utils/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status-codes";
import { AccountStatus, AgentApprovalStatus } from "./user.interface";
import AppError from "../../../helpers/AppError";

const createNewUser = catchAsync(async (req,res)=>{
 const user = await UserService.createNewUser(req.body);




    SendResponse(res,{
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user 
    })
})


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await UserService.getAllUsers(req.query as  Record<string, string>);

 SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data,
    meta
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.getSingleUser(id);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});


const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;  
  const updateData = req.body;

  const updatedUser = await UserService.updateUser(userId, updateData);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { role } = req.body;

  const updatedUser = await UserService.updateUserRole(userId, role);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: updatedUser,
  });
});

const updateAccountStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.query;

  const updatedUser = await UserService.updateAccountStatus(
    id,
    status as AccountStatus
  );

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: updatedUser,
  });
});


const updateAgentApprovalStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.query.id as string;
  const approvalStatus = req.query.status as string;

  if (
    approvalStatus !== AgentApprovalStatus.ACCEPTED &&
    approvalStatus !== AgentApprovalStatus.REJECTED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status query param");
  }

  const updatedUser = await UserService.updateAgentApprovalStatus(
    userId,
    approvalStatus as AgentApprovalStatus
  );

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Agent ${approvalStatus}`,
    data: updatedUser,
  });
});


export const userController = {
    createNewUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserRole,
    updateAccountStatus,
    updateAgentApprovalStatus
}