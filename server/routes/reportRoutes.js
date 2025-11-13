import express from "express";
import { getSummaryReports } from "../controllers/reportController.js";

const router = express.Router();

router.get("/summary", getSummaryReports);

export default router;
