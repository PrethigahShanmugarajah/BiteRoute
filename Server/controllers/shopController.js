// BiteRoute / Server / controllers / shopController.js
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
      isNewShop = true;
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
      }`
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
    const shop = await Shop.findOne({ owner: req.userId });

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
