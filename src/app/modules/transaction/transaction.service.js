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
exports.transactioService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const transaction_model_1 = require("./transaction.model");
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = transaction_model_1.Transaction.find().populate([
        { path: "user", select: "name email" },
        { path: "agent", select: "name email" },
        { path: "receiver", select: "name email" },
    ]);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(baseQuery, query);
    const data = yield queryBuilder.filter().search(["type"]).sort().fields().paginate().build();
    const meta = yield queryBuilder.getMeta();
    return { data, meta };
});
//  const getTransactionById= async (id: string) => {
//     const transaction = await Transaction.findById(id).populate([
//       { path: "user", select: "name email" },
//       { path: "agent", select: "name email" },
//       { path: "receiver", select: "name email" },
//     ]);
//     return transaction;
//   }
exports.transactioService = {
    getAllTransactions,
    // getTransactionById,
};
