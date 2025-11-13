import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "../config/db.js";
import transactionRoutes from "../routes/transactionRoutes.js";
import reportRoutes from "../routes/reportRoutes.js";

const app = express();

// Connect to MongoDB ONCE
connectDB();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("FinEase Backend Running on Vercel");
});

export default app;
