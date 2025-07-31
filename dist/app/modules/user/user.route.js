"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../../middleWares/checkAuth");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.userController.createNewUser);
router.get("/", (0, checkAuth_1.checkAuth)("admin"), user_controller_1.userController.getAllUsers);
router.get("/:id", (0, checkAuth_1.checkAuth)("admin", "user", "agent"), user_controller_1.userController.getSingleUser);
router.patch("/:id", (0, checkAuth_1.checkAuth)("user", "agent", "admin"), user_controller_1.userController.updateUser);
// Fixed: Changed from /status/:id to /:id/status
router.patch("/:id/status", (0, checkAuth_1.checkAuth)("admin"), user_controller_1.userController.updateAccountStatus);
router.patch("/:id/role", (0, checkAuth_1.checkAuth)("admin"), user_controller_1.userController.updateUserRole);
// Fixed: Changed from /agentApproval to /agent-approval (more RESTful)
router.patch("/agent-approval", (0, checkAuth_1.checkAuth)("admin"), user_controller_1.userController.updateAgentApprovalStatus);
exports.UserRoutes = router;
