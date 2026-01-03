// BiteRoute / Server / server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

/* -------- INITIALIZE EXPRESS -------- */
const app = express();

/* -------- CONNECT TO DATABASE -------- */
await connectDB();

/* -------- MIDDLEWARE CONFIGURATION -------- */
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/* -------- ROUTES -------- */
app.get("/", (req, res) => res.send("API is Working!"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

/* -------- PORT -------- */
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
