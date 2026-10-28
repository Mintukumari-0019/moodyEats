import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/food-del";
        await mongoose.connect(uri);
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Connection Error:", error.message);
    }
}
