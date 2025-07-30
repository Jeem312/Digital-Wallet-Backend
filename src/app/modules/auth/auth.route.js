"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controll_1 = require("./auth.controll");
const router = (0, express_1.Router)();
router.post("/login", auth_controll_1.authController.loginUser);
router.post("/logout", auth_controll_1.authController.logoutUser);
exports.AuthRoutes = router;
