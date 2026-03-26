import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB Connection Error", error);
        process.exit(1);
    }
};
