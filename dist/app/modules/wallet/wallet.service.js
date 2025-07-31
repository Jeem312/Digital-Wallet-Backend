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
exports.WalletService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
const tansaction_interface_1 = require("../transaction/tansaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find()
        .populate("user", "name email role");
    return wallets;
});
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    return wallet;
});
const CHARGE_PERCENTAGE = 5;
const cashIn = (userId, agentId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const userWallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agentId });
    if (!userWallet || !agentWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User or agent wallet not found");
    }
    if (!userId || !agentId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User ID and Agent ID are required");
    }
    if (userId === agentId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User and Agent cannot be the same");
    }
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Amount must be a positive number");
    }
    const charge = (amount * CHARGE_PERCENTAGE) / 100;
    const finalAmount = amount - charge;
    if (userWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User wallet is blocked");
    }
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        const userWallet = yield wallet_model_1.Wallet.findOne({ user: userId });
        const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agentId });
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
        }
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
        }
        if (userWallet.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User wallet is blocked");
        }
        if (agentWallet.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent wallet is blocked");
        }
        userWallet.balance += finalAmount;
        agentWallet.balance += charge;
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        yield transaction_model_1.Transaction.create([{
                type: tansaction_interface_1.TransactionType.CASH_IN,
                amount,
                charge: 0,
                user: userId,
                agent: agentId,
                userWalletBalance: userWallet.balance,
                agentWalletBalance: agentWallet.balance
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            userBalance: userWallet.balance,
            agentBalance: agentWallet.balance
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashOut = (userId, agentId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const charge = (amount * CHARGE_PERCENTAGE) / 100;
    const totalDeduction = amount + charge;
    const userWallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agentId });
    if (!userWallet || !agentWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User or agent wallet not found");
    }
    if (userWallet.balance < totalDeduction) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    if (userWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User wallet is blocked");
    }
    userWallet.balance -= totalDeduction;
    agentWallet.balance += charge;
    yield userWallet.save();
    yield agentWallet.save();
    yield transaction_model_1.Transaction.create({
        type: tansaction_interface_1.TransactionType.CASH_OUT,
        amount,
        charge,
        user: userId,
        agent: agentId,
    });
    return { userBalance: userWallet.balance, agentBalance: agentWallet.balance };
});
const sendMoney = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Sender ID:", senderId, "Receiver ID:", receiverId, "Amount:", amount);
    if (!senderId || !receiverId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender and receiver IDs are required");
    }
    if (senderId === receiverId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender and receiver cannot be the same");
    }
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Amount must be a positive number");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: senderId }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverId }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender or receiver wallet not found");
        }
        if (senderWallet.isBlocked || receiverWallet.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Sender or receiver wallet is blocked");
        }
        if (senderWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance in sender's wallet");
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield transaction_model_1.Transaction.create([{
                type: tansaction_interface_1.TransactionType.TRANSFER,
                amount,
                user: senderId,
                receiver: receiverId,
                senderWalletBalance: senderWallet.balance,
                receiverWalletBalance: receiverWallet.balance
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "Money transferred successfully",
            senderBalance: senderWallet.balance,
            receiverBalance: receiverWallet.balance
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const setWalletBlockedStatus = (walletId, blocked) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById({ _id: walletId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    wallet.isBlocked = blocked ? true : false;
    yield wallet.save();
    return wallet;
});
exports.WalletService = {
    getAllWallets,
    getWalletByUserId,
    cashIn,
    cashOut,
    sendMoney,
    setWalletBlockedStatus
};
