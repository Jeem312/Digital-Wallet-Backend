"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = require("./middleWares/globalErrorHandler");
const notFound_1 = require("./middleWares/notFound");
const index_1 = require("./app/routes/index");
const envConfig_1 = require("./config/envConfig");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: envConfig_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.set("trust proxy", 1);
app.use("/api/v1", index_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet Backend "
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFoundHandler);
exports.default = app;
