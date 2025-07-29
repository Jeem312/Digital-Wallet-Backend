import { catchAsync } from "../../../utils/catchAsync";
import { SendResponse } from "../../../utils/sendResponse";
import { UserService } from "./user.service";

const createNewUser = catchAsync(async (req,res)=>{
 const user = await UserService.createNewUser(req.body);




    SendResponse(res,{
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user 
    })
})

const getAllUsers = catchAsync(async (req, res) => {
  
  const users = await UserService.getAllUsers();
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: users,
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

export const userController = {
    createNewUser,
    getAllUsers,
    getSingleUser
}