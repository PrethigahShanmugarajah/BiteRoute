// BiteRoute / Server / controllers / authController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/token.js";

/* -------- SignUp -------- */
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 digits." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const responseUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res
      .status(201)
      .json({
        success: true,
        message: "SignUp successfully!",
        user: responseUser,
      });
  } catch (error) {
    console.error("SignUp Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to SignUp",
      error: `SignUp Error: ${error.message}`,
    });
  }
};
