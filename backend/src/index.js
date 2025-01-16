import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT;


app.use(express.json()); // allows you to extract the data from the json body
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    connectDB();
} )