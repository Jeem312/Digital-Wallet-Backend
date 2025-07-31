"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const envConfig_1 = require("../config/envConfig");
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: envConfig_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: envConfig_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
