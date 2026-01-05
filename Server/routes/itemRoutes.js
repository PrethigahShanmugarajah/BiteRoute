// Cravely / Server / routes / itemRoutes.js
import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addItem,
  getItemById,
  updateItem,
} from "../controllers/itemController.js";
import upload from "../middlewares/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.put(
  "/update-item/:itemId",
  isAuth,
  upload.single("image"),
  updateItem
);
itemRouter.get("/get-item/:itemId", isAuth, getItemById);

export default itemRouter;
