// BiteRoute / Server / controllers / shopController.js
import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/* -------- Create or Edit Shop -------- */
export const createEditShop = async (req, res) => {
  let isNewShop = false;

  try {
    const { name, district, province, address } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      isNewShop = true;
      shop = await Shop.create({
        name,
        district,
        province,
        address,
        image,
        owner: req.userId,
      });
      isNewShop = true;
    } else {
      let updateData = { name, district, province, address, owner: req.userId };
      if (image) updateData.image = image;

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner");

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
