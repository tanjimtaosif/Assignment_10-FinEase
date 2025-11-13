import express from "express";
import cors from "cors";
import morgan from "morgan";;
import connectDB from "../config/db.js";
import transactionRoutes from "../routes/transactionRoutes.js";
import reportRoutes from "../routes/reportRoutes.js";

connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("FinEase Backend is Running on Vercel");
});

export default app;
