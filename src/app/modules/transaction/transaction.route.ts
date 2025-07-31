
import { Router } from "express";
import {  transactionController } from "./transaction.controller";
import { checkAuth } from "../../../middleWares/checkAuth";


const router = Router();


router.get("/", checkAuth("admin"), transactionController.getAllTransactions);

router.get("/myHistory", checkAuth("admin","user","agent"), transactionController.getTransactionById);
router.get("/commission/:id",checkAuth("agent"), transactionController.getAgentCommissionHistory);


export const TransactionRoutes = router;
