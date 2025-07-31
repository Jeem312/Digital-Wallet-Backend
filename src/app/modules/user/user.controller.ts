import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { SendResponse } from "../../../utils/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status-codes";

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

export const userController = {
    createNewUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserRole
}