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
exports.walletController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const wallet_service_1 = require("./wallet.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_service_1.WalletService.getAllWallets();
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All wallets retrieved successfully",
        data: wallets
    });
}));
const getWalletByUserId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId.trim();
    const wallet = yield wallet_service_1.WalletService.getWalletByUserId(userId);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User wallet fetched successfully",
        data: wallet
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, agentId } = req.query;
    const { amount } = req.body;
    const result = yield wallet_service_1.WalletService.cashIn(userId, agentId, amount);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Cash-in successful",
        data: result,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, agentId } = req.query;
    const { amount } = req.body;
    const result = yield wallet_service_1.WalletService.cashOut(userId, agentId, amount);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Cash-out successful",
        data: result,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.query;
    const { amount } = req.body;
    // console.log("Sender ID:", senderId, "Receiver ID:", receiverId, "Amount:", amount);
    const result = yield wallet_service_1.WalletService.sendMoney(senderId, receiverId, amount);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: result.message,
        data: {
            senderBalance: result.senderBalance,
            receiverBalance: result.receiverBalance,
        },
    });
}));
const blockWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.walletId;
    const { isBlocked } = req.body;
    const wallet = yield wallet_service_1.WalletService.setWalletBlockedStatus(walletId, isBlocked);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Wallet ${isBlocked ? "blocked" : "unblocked"} successfully`,
        data: wallet
    });
}));
exports.walletController = {
    getAllWallets,
    getWalletByUserId,
    cashIn,
    cashOut,
    sendMoney,
    blockWallet
};
