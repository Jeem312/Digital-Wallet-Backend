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

// Fixed: Changed from /status/:id to /:id/status
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

// Fixed: Changed from /agentApproval to /agent-approval (more RESTful)
router.patch(
  "/agent-approval", 
  checkAuth("admin"), 
  userController.updateAgentApprovalStatus
);



export const UserRoutes = router;