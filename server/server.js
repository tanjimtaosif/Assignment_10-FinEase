import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config({ path: ".env.local" });
connectDB();

const app = express();

// middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

// health check
app.get("/", (req, res) => {
    res.send("FinEase API is running");
});

// simple error handler fallback
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
