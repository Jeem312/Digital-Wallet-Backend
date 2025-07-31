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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const userToken_1 = require("../../../utils/userToken");
const user_interface_1 = require("../user/user.interface");
exports.AuthService = {
    // ---------- LOGIN ----------
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User is deleted");
        }
        if (user.isActive === user_interface_1.isActive.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User is blocked");
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, user.password || "");
        if (!isPasswordMatched) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid credentials");
        }
        const tokens = (0, userToken_1.createUserTokens)(user);
        const _a = user.toObject(), { password: pass } = _a, userData = __rest(_a, ["password"]);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userData,
        };
    }),
    // ---------- LOGOUT ----------
    logoutUser: (res) => __awaiter(void 0, void 0, void 0, function* () {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return { message: "Logged out successfully" };
    }),
};
