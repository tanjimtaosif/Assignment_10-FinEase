import express from "express";
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);

router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
