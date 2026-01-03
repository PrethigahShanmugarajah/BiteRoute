// BiteRoute / Server / controllers / authController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

/* -------- SignUp -------- */
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (mobile.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be at least 10 digits.",
      });
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

    return res.status(201).json({
      success: true,
      token,
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

/* -------- SignIn -------- */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }

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

    return res.status(200).json({
      success: true,
      token,
      message: "SignIn successfully!",
      user: responseUser,
    });
  } catch (error) {
    console.error("SignIn Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to SignIn",
      error: `SignIn Error: ${error.message}`,
    });
  }
};

/* -------- SignOut -------- */
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");

    return res
      .status(200)
      .json({ success: true, message: "Signout successfully!" });
  } catch (error) {
    console.error("SignOut Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to SignOut",
      error: `SignOut Error: ${error.message}`,
    });
  }
};

/* -------- Send OTP -------- */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendOtpMail(email, otp);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully!", otp });
  } catch (error) {
    console.error("Send OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Send OTP",
      error: `Send OTP Error: ${error.message}`,
    });
  }
};

/* -------- Verify OTP -------- */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }

    // if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid or expired OTP." });
    // }

    if (user.resetOtp !== otp.trim() || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to Verify OTP",
      error: `Verify OTP Error: ${error.message}`,
    });
  }
};
