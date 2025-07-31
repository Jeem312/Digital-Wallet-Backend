import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../../middleWares/checkAuth";

const router = Router();

router.post("/register", userController.createNewUser);

router.patch(
  "/agent-approval", 
  checkAuth("admin"), 
  userController.updateAgentApprovalStatus
);

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

router.patch(
  "/:id/status",
  checkAuth("admin"), 
  userController.updateAccountStatus
);

router.patch(
  "/:id/role",
  checkAuth("admin"), 
  userController.updateUserRole
);




export const UserRoutes = router;