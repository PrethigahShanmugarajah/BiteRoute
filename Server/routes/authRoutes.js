// Cravely / Server / routes / authRoutes.js
import express from "express";
import {
  sendOtp,
  signIn,
  signOut,
  signUp,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", sendOtp);

export default authRouter;
