/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { Transaction } from "./transaction.model";


 const getAllTransactions = async (query: any) => {
    const baseQuery = Transaction.find().populate([
      { path: "user", select: "name email" },
      { path: "agent", select: "name email" },
      { path: "receiver", select: "name email" },
    ]);

    const queryBuilder = new QueryBuilder(baseQuery, query);
    const data = await queryBuilder.filter().search(["type"]).sort().fields().paginate().build();
    const meta = await queryBuilder.getMeta();

    return { data, meta };
  }

//  const getTransactionById= async (id: string) => {
//     const transaction = await Transaction.findById(id).populate([
//       { path: "user", select: "name email" },
//       { path: "agent", select: "name email" },
//       { path: "receiver", select: "name email" },
//     ]);
//     return transaction;
//   }

  export const transactioService = {
    getAllTransactions,
    // getTransactionById,
    
  }

