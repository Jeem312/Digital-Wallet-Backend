"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const tansaction_interface_1 = require("./tansaction.interface");
const transactionSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    agent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    type: {
        type: String,
        enum: Object.values(tansaction_interface_1.TransactionType),
        required: true,
    },
    charge: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ["success", "failed"],
        default: "success",
    },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
