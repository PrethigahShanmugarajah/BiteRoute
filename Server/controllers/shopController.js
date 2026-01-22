import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/* -------- Create or Edit Shop -------- */
export const createEditShop = async (req, res) => {
  let isNewShop = false;

  try {
    const { name, city, state, address } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      isNewShop = true;
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      let updateData = { name, city, state, address, owner: req.userId };
      if (image) updateData.image = image;

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner items");

    return res.status(isNewShop ? 201 : 200).json({
      success: true,
      message: isNewShop
        ? "Shop created successfully!"
        : "Shop updated successfully!",
      shop,
    });
  } catch (error) {
    console.error(
      `${isNewShop ? "Create Shop Error" : "Update Shop Error"}: ${
        error.message
      }`,
    );

    return res.status(500).json({
      success: false,
      message: isNewShop ? "Failed to Create Shop" : "Failed to Update Shop",
      error: `${isNewShop ? "Create Shop Error" : "Update Shop Error"}: ${
        error.message
      }`,
    });
  }
};

/* -------- Get My Shop -------- */
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate({ path: "items", options: { sort: { updatedAt: -1 } } });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop fetched successfully!",
      shop,
    });
  } catch (error) {
    console.error("Get My Shop Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
      error: `Get My Shop Error: ${error.message}`,
    });
  }
};

/* -------- Get Shop By City -------- */
export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No shops found in ${city}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Shops in ${city} fetched successfully!`,
      shops,
    });
  } catch (error) {
    console.error("Get Shop By City Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops by city",
      error: `Get Shop By City Error: ${error.message}`,
    });
  }
};
