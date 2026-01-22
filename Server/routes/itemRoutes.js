import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addItem,
  addRating,
  deleteItem,
  getItemByCity,
  getItemById,
  getItemsByShop,
  searchItems,
  updateItem,
} from "../controllers/itemController.js";
import upload from "../middlewares/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.put(
  "/update-item/:itemId",
  isAuth,
  upload.single("image"),
  updateItem,
);
itemRouter.get("/get-item/:itemId", isAuth, getItemById);
itemRouter.delete("/delete-item/:itemId", isAuth, deleteItem);
itemRouter.get("/get-item-shop-by-city/:city", isAuth, getItemByCity);
itemRouter.get("/get-item-by-shop/:shopId", isAuth, getItemsByShop);
itemRouter.get("/search-items", isAuth, searchItems);
itemRouter.post("/add-rating", isAuth, addRating);

export default itemRouter;
