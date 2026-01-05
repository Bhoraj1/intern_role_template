import { sendResponse } from "../utils/responseUtils.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, {
        success: false,
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(res, {
        success: false,
        message: "Access denied",
        statusCode: 403,
      });
    }

    next();
  };
};
