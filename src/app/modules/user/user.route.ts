import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../../middleWares/checkAuth";

const router = Router();

router.post("/register", userController.createNewUser);
router.get(
    "/",
    checkAuth("admin"),
   
    userController.getAllUsers
);
router.get(
    "/:id",
    checkAuth("admin", "user","agent"),
    userController.getSingleUser
);
router.patch(
  "/:id",
  checkAuth("user", "agent", "admin"),  
  userController.updateUser
);
router.patch("/status/:id",
  checkAuth("admin"), 
  userController.updateAccountStatus
);

router.patch(
  "/role/:id",
  checkAuth("admin"), 
  userController.updateUserRole
);

console.log("✅ user route file loaded");

router.patch("/agentApproval",checkAuth("admin") ,userController.updateAgentApprovalStatus);

export const UserRoutes = router;
