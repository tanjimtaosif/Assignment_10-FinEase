import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
    try {
        const payload = { ...req.body };

        // normalize + validate type
        if (payload.type) {
            payload.type = String(payload.type).toLowerCase();
            if (!["income", "expense"].includes(payload.type)) {
                return res
                    .status(400)
                    .json({ message: "Type must be income or expense" });
            }
        }

        const tx = await Transaction.create(payload);
        res.status(201).json(tx);
    } catch (err) {
        console.error("Create error:", err);
        res
            .status(400)
            .json({ message: err.message || "Failed to create transaction" });
    }
};

export const getTransactions = async (req, res) => {
    try {
        let {
            email,
            type,
            q,
            page = "1",
            limit = "8",
            sort = "date",
            order = "desc",
        } = req.query;

        if (!email) {
            return res.status(400).json({ message: "email query is required" });
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 8);

        const filter = { email };

        if (type && type !== "all") {
            filter.type = type; // "income" | "expense"
        }

        if (q) {
            const regex = new RegExp(q, "i");
            filter.$or = [{ category: regex }, { description: regex }];
        }

        const sortField = sort === "amount" ? "amount" : "date";
        const sortOrder = order === "asc" ? 1 : -1;

        const sortObj = {
            [sortField]: sortOrder,
            createdAt: -1, // tie-breaker for equal values
        };

        const total = await Transaction.countDocuments(filter);

        const transactions = await Transaction.find(filter)
            .sort(sortObj)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        return res.json({
            data: transactions,
            total,
        });
    } catch (err) {
        console.error("List error:", err);
        res
            .status(500)
            .json({ message: err.message || "Failed to fetch transactions" });
    }
};

/**
 * GET /api/transactions/:id
 */
export const getTransactionById = async (req, res) => {
    try {
        const tx = await Transaction.findById(req.params.id);
        if (!tx) return res.status(404).json({ message: "Transaction not found" });
        res.json(tx);
    } catch (err) {
        console.error("Get by id error:", err);
        res.status(400).json({ message: err.message || "Invalid id" });
    }
};

/**
 * PUT /api/transactions/:id
 */
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // normalize + validate type if present
        if (updates.type) {
            updates.type = String(updates.type).toLowerCase();
            if (!["income", "expense"].includes(updates.type)) {
                return res
                    .status(400)
                    .json({ message: "Type must be income or expense" });
            }
        }

        const tx = await Transaction.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!tx) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(tx);
    } catch (err) {
        console.error("Update error:", err);
        res
            .status(400)
            .json({ message: err.message || "Failed to update transaction" });
    }
};

/**
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = async (req, res) => {
    try {
        const tx = await Transaction.findByIdAndDelete(req.params.id);
        if (!tx) return res.status(404).json({ message: "Transaction not found" });
        res.json({ ok: true });
    } catch (err) {
        console.error("Delete error:", err);
        res
            .status(400)
            .json({ message: err.message || "Failed to delete transaction" });
    }
};

/**
 * Returns { income, expense, balance }
 */
export const getSummary = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "email query is required" });
        }

        const all = await Transaction.aggregate([
            { $match: { email } },
            { $group: { _id: "$type", total: { $sum: "$amount" } } },
        ]);

        let income = 0;
        let expense = 0;

        for (const row of all) {
            if (row._id === "income") income = row.total;
            if (row._id === "expense") expense = row.total;
        }

        res.json({
            income,
            expense,
            balance: income - expense,
        });
    } catch (err) {
        console.error("Summary error:", err);
        res
            .status(500)
            .json({ message: err.message || "Failed to get summary" });
    }
};
