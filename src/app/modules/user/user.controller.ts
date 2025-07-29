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

export const userController = {
    createNewUser
}