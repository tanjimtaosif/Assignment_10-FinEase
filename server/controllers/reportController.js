import Transaction from "../models/Transaction.js";

export const getSummaryReports = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ message: "Month is required" });
        }

        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const byCategory = await Transaction.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            { $group: { _id: "$category", value: { $sum: "$amount" } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        const monthly = await Transaction.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: null,
                    income: {
                        $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
                    },
                    expense: {
                        $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
                    }
                }
            }
        ]);

        const totalIncome = monthly[0]?.income || 0;
        const totalExpense = monthly[0]?.expense || 0;

        res.json({
            byCategory,
            monthly: [
                { category: "Income", income: totalIncome, expense: 0 },
                { category: "Expense", income: 0, expense: totalExpense }
            ],
            totalIncome,
            totalExpense,
        });

    } catch (error) {
        console.error("Report error:", error);
        res.status(500).json({ message: "Failed to load reports" });
    }
};
