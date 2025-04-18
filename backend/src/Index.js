import express from "express";
import authRoutes from './routes/auth.route.js'
import MessageRoutes from './routes/message.route.js'
import dotenv from "dotenv";
import {connectDB} from './lib/db.js';
import cookieParser from "cookie-parser"
import cors from "cors";
import { app ,server} from "./lib/socket.js";

dotenv.config();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));



app.use("/api/auth",authRoutes)
app.use("/api/messages",MessageRoutes)

server.listen(PORT,()=>{
    console.log("Server running on "+PORT);
    connectDB();
})