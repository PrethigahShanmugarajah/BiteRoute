// BiteRoute / Server / middlewares isAuth.js
import jwt from "jsonwebtoken";

/*-------- Authentication middleware --------*/
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodeToken) {
      return res
        .status(401)
        .json({ success: false, message: "Token verification failed." });
    }

    console.log(decodeToken);
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    console.error("Authentication middleware Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: `Authentication middleware Error: ${error.message}`,
    });
  }
};
