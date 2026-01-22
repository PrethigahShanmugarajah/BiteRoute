import User from "../models/userModel.js";

/* -------- Get Current Logged-in User -------- */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. User ID not found." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const { password, ...safeUser } = user._doc;

    return res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Get Current Logged-in User Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Get Current User",
      error: `Get Current Logged-in User Error: ${error.message}`,
    });
  }
};

/* -------- Update User Location -------- */
export const updateUserLocation = async (req, res) => {
  try {
    let { lat, lon } = req.body;

    lat = Number(lat);
    lon = Number(lon);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid latitude or longitude" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { location: { type: "Point", coordinates: [lon, lat] } },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Location Updated!",
      location: user.location,
    });
  } catch (error) {
    console.error("Update User Location Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update user location",
      error: `Update User Location Error: ${error.message}`,
    });
  }
};
