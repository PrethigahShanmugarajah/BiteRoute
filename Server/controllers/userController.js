// BiteRoute / Server / controllers / userController.js
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

    return res
      .status(200)
      .json({
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
