"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const setCookie_1 = require("../../../utils/setCookie");
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = yield auth_service_1.AuthService.loginUser(email, password);
    (0, setCookie_1.setAuthCookie)(res, { accessToken, refreshToken });
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
        }
    });
}));
const logoutUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    yield auth_service_1.AuthService.logoutUser(token);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
        data: null
    });
}));
exports.authController = {
    loginUser,
    logoutUser,
};
