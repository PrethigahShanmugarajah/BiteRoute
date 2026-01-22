import jwt from "jsonwebtoken";

/* -------- Generate JWT Token -------- */
export const genToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.log("JWT Generation Error:", error);
    return null;
  }
};
