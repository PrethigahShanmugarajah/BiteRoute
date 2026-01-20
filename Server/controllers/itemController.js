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

    shop.items.push(item._id);
    await shop.save();

    await shop.populate("owner");

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res
      .status(201)
      .json({ success: true, message: "Item added successfully!", shop });
  } catch (error) {
    console.error("Add Item Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Add Item",
      error: `Add Item Error: ${error.message}`,
    });
  }
};

/* -------- Update Item -------- */
export const updateItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({
      success: true,
      message: "Item updated successfully!",
      shop,
    });
  } catch (error) {
    console.error("Update Item Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Update Item",
      error: `Update Item Error: ${error.message}`,
    });
  }
};

/* -------- Get Item By Id -------- */
export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item fetched successfully!",
      item,
    });
  } catch (error) {
    console.error("Get Item By Id Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: `Get Item By Id Error: ${error.message}`,
    });
  }
};

/* -------- Delete Item -------- */
export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

    shop.items = shop.items.filter((i) => i !== item._id);

    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully!",
      shop,
    });
  } catch (error) {
    console.error("Delete Item Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Delete Item",
      error: `Delete Item Error: ${error.message}`,
    });
  }
};

/* -------- Get Item By City -------- */
export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required!",
      });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No shops found in ${city}.`,
      });
    }

    const shopIds = shops.map((shop) => shop._id);

    const items = await Item.find({ shop: { $in: shopIds } });

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully!",
      items,
    });
  } catch (error) {
    console.error("Get Item By City Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get items by city",
      error: `Get Item By City Error: ${error.message}`,
    });
  }
};

/* -------- Get Items By Shop -------- */
export const getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully!",
      shop,
      items: shop.items,
    });
  } catch (error) {
    console.error("Get Items By Shop Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get items by shop",
      error: `Get Items By Shop Error: ${error.message}`,
    });
  }
};

/* -------- Search Items -------- */
export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) {
      null;
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops) {
      return res.status(404).json({
        success: false,
        message: "Shops not found.",
      });
    }

    const shopIds = shops.map((s) => s._id);
    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "name image");

    return res
      .status(200)
      .json({ success: true, message: "Items fetched successfully!", items });
  } catch (error) {
    console.error("Search Items Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to search items",
      error: `Search Items Error: ${error.message}`,
    });
  }
};
