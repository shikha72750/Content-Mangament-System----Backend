import authRoutes from "./router/authRoutes.js";
import express from "express";
import dbConnect from "./config/database.js"
import cors from "cors"
import dotenv from "dotenv"
import blogRoutes from "./router/blogRoutes.js";
import path from "path";

dotenv.config()
const app = express();
dbConnect();

const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRoutes)
app.use("/api/blog", blogRoutes)
app.use("/uploads", express.static(path.resolve("uploads")));

app.listen(PORT, () => {
    console.log(`Server is running successfully at port ${PORT}`);

})

export default app;




























































