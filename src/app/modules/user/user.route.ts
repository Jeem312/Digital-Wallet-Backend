import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../../middleWares/checkAuth";

const router = Router();

router.post("/register", userController.createNewUser);
router.get("/allUsers", checkAuth("admin"), userController.getAllUsers);
router.get("/:id", checkAuth("admin", "user","agent"), userController.getSingleUser);

export const UserRoutes = router;
