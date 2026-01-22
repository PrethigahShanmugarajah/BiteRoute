import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  getCurrentUser,
  updateUserLocation,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/userget", isAuth, getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);

export default userRouter;
