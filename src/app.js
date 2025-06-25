import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blog.route.js";
import commentRouter from "./routes/comment.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import likeRouter from "./routes/like.route.js";
import subscriptionRouter from "./routes/subscription.route.js"; // corrected import name
import path from "path";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // fallback for dev
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter); // consistent naming

export { app };