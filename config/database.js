import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const dbConnect = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI)
        if (db) {
            console.log("database connected successfully");
        }
    } catch (err) {
        console.log(err.message)
    }
};

export default dbConnect;