// Cravely / Server / routes / itemRoutes.js
import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { addItem, updateItem } from "../controllers/itemController.js";
import upload from "../middlewares/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.put(
  "/update-item/:itemId",
  isAuth,
  upload.single("image"),
  updateItem
);

export default itemRouter;
