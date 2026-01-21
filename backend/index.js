import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config(); // MUST be first

const PORT = process.env.PORT || 8808;
const __dirname = path.resolve();

// Test if MONGO_URL is loaded
console.log("MONGO_URL =", process.env.MONGO_URL);

// Connect to MongoDB first
connectDB()
  
    // Middlewares
    app.use(express.json());
    app.use(cookieParser());
    app.use(urlencoded({ extended: true }));

    const corsOptions = {
      origin: process.env.URL,
      credentials: true,
    };
    app.use(cors(corsOptions));

    // Routes
    app.use("/api/v1/user", userRoute);
    app.use("/api/v1/post", postRoute);
    app.use("/api/v1/message", messageRoute);

    // Serve frontend
    //app.use(express.static(path.join(__dirname, "/frontend/dist")));
    //app.get("*", (req, res) => {
     // res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
   // });

    // Start server
    server.listen(PORT, () => {
      console.log(`Server listening at port ${PORT}`);
    });
  
 