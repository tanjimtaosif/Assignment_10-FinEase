import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { timestamps: true }
);

// helpful indexes
transactionSchema.index({ email: 1, date: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
