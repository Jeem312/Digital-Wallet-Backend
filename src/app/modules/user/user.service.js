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
exports.UserService = void 0;
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
const user_interface_1 = require("./user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const envConfig_1 = require("../../../config/envConfig");
const wallet_model_1 = require("../wallet/wallet.model");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const createNewUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExists = yield user_model_1.User.findOne({
        email
    });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User Already Exist');
    }
    const passwordHash = yield bcryptjs_1.default.hash(password, envConfig_1.envVars.BCRYPT_SALT_ROUND);
    const userData = Object.assign(Object.assign({}, rest), { email, password: passwordHash, role: payload.role || user_interface_1.Role.USER, status: user_interface_1.isActive.ACTIVE, isVerified: false, isDeleted: false });
    if (payload.role === user_interface_1.Role.AGENT) {
        userData.role = user_interface_1.Role.PENDING;
    }
    const user = yield user_model_1.User.create(userData);
    // Create wallet
    const wallet = yield wallet_model_1.Wallet.create({
        user: user._id,
        balance: 50,
    });
    user.wallet = wallet._id;
    yield user.save();
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query)
        .filter()
        .search(["email", "name"])
        .sort()
        .paginate();
    const data = yield queryBuilder.build();
    const meta = yield queryBuilder.getMeta();
    return { data, meta };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const updateUser = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (updateData && "role" in updateData) {
        delete updateData.role;
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return updatedUser;
});
const updateUserRole = (userId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(user_interface_1.Role).includes(newRole)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid role");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { role: newRole }, { new: true, runValidators: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return updatedUser;
});
const updateAccountStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedStatus = status.trim().toLowerCase();
    // Check if the normalized status is a valid enum value
    if (!Object.values(user_interface_1.isActive).includes(normalizedStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid account status");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { status: normalizedStatus }, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return updatedUser;
});
const updateAgentApprovalStatus = (userId, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(user_interface_1.AgentApprovalStatus).includes(approvalStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid approval status");
    }
    let newRole = user_interface_1.Role.USER;
    if (approvalStatus === user_interface_1.AgentApprovalStatus.ACCEPTED) {
        newRole = user_interface_1.Role.AGENT;
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
        agentApproval: approvalStatus,
        role: newRole,
    }, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return updatedUser;
});
exports.UserService = {
    createNewUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserRole,
    updateAccountStatus,
    updateAgentApprovalStatus
};
