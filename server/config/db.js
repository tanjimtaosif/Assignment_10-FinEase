import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        // Avoid creating multiple connections in serverless environment
        return;
    }

    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI is not defined in environment variables");
        throw new Error("MONGO_URI is missing");
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10s timeout instead of infinite buffering
        });
        isConnected = true;
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
};

export default connectDB;
