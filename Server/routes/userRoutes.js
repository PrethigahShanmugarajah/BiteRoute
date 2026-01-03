// Cravely / Server / routes / userRoutes.js
import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/userget", isAuth, getCurrentUser);

export default userRouter;
