import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/responseUtils.js";

export const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return sendResponse(res, {
        success: false,
        message: "You have to login first",
        statusCode: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: "Invalid token",
      statusCode: 401,
    });
  }
};
