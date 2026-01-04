// Cravely / Server / routes / shopRoutes.js
import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createEditShop } from "../controllers/shopController.js";
import upload from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("file"), createEditShop);

export default shopRouter;
