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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserTokens = void 0;
const user_interface_1 = require("../app/modules/user/user.interface");
const user_model_1 = require("../app/modules/user/user.model");
const envConfig_1 = require("../config/envConfig");
const AppError_1 = __importDefault(require("../helpers/AppError"));
const jwt_1 = require("./jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, envConfig_1.envVars.JWT_ACCESS_SECRET, envConfig_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, envConfig_1.envVars.JWT_REFRESH_SECRET, envConfig_1.envVars.JWT_REFRESH_SECRET_EXPIRED);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserTokens = createUserTokens;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = (0, jwt_1.verifyToken)(refreshToken, envConfig_1.envVars.JWT_REFRESH_SECRET);
    if (typeof verifiedToken !== 'object' || !('email' in verifiedToken)) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Invalid refresh token');
    }
    const { email } = verifiedToken;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User Not Exist');
    }
    if (isUserExist.isActive === user_interface_1.isActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.isActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User is Blocked/Inactive');
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User deleted');
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, envConfig_1.envVars.JWT_ACCESS_SECRET, envConfig_1.envVars.JWT_ACCESS_EXPIRES);
    return {
        accessToken,
    };
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
