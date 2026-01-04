// BiteRoute / Server / utils / cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/* -------- Upload File to Cloudinary -------- */
const uploadOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  try {
    const result = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file);
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
    console.error("Upload On Cloudinary Error:", error.message);
    throw new Error(`Upload On Cloudinary Error: ${error.message}`);
  }
};

export default uploadOnCloudinary;
