
import { Router } from "express";
import {  transactionController } from "./transaction.controller";
import { checkAuth } from "../../../middleWares/checkAuth";


const router = Router();


router.get("/", checkAuth("admin"), transactionController.getAllTransactions);
console.log("📦 Transaction Route Loaded");

// router.get("/:id", checkAuth("admin","user","agent"), transactionController.getTransactionById);

export const TransactionRoutes = router;
