// BiteRoute / Server / controllers / itemController.js
import Item from "../models/itemModel.js";
import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/* -------- Add Item -------- */
export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found. Please create a shop first.",
      });
    }

    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Item added successfully!", item });
  } catch (error) {
    console.error("Add Item Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Add Item",
      error: `Add Item Error: ${error.message}`,
    });
  }
};
