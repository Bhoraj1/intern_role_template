import db from "../config/dbConnect.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/authUtils.js";
import { sendResponse } from "../utils/responseUtils.js";
import { removeImg } from "../utils/removeImg.js";
import { compressImg } from "../utils/compressImg.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const validRoles = ["admin", "manager", "staff", "user"];

    if (role && !validRoles.includes(role)) {
      if (req.file) {
        removeImg(req.file.path);
      }
      return sendResponse(res, {
        success: false,
        message: "Invalid role. Valid roles are: admin, manager, staff, user",
        statusCode: 400,
      });
    }

    // Check if user already exists
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      if (req.file) {
        removeImg(req.file.path);
      }
      return sendResponse(res, {
        success: false,
        message: "Email already exists. Use another email.",
        statusCode: 409,
      });
    }

    const userRole =
      role && ["admin", "manager", "staff"].includes(role) ? role : "user";
    const hashedPassword = await hashPassword(password);

    let imagePath = "";
    if (req.file) {
      const outputPath = `uploads/users/user-${req.file.filename}`;
      await compressImg(req.file.path, outputPath);
      imagePath = outputPath;
    }

    const result = await db.query(
      "INSERT INTO users (username, email, password, role, image) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, image, created_at",
      [username, email, hashedPassword, userRole, imagePath]
    );

    return sendResponse(res, {
      message: "User registered successfully",
      data: result.rows[0],
      statusCode: 201,
    });
  } catch (error) {
    if (req.file) {
      removeImg(req.file.path);
    }
    if (error.code === "23505") {
      return sendResponse(res, {
        success: false,
        message: "Username or email already exists",
        statusCode: 400,
      });
    }
    return sendResponse(res, {
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        success: false,
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, {
        success: false,
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const token = generateToken({
      username: user.username,
      role: user.role,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return sendResponse(res, {
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

// Get users based on role hierarchy
export const getAllUsers = async (req, res) => {
  try {
    const currentUserRole = req.user.role;

    let query = "SELECT id, username, email, role, image, created_at FROM users";
    let params = [];

    // Filter users based on current user's role
    if (currentUserRole === "super_admin") {
      // Super admin can see all users
      query += " ORDER BY created_at DESC";
    } else if (currentUserRole === "admin") {
      // Admin can see manager, staff, user
      query += " WHERE role IN ($1, $2, $3) ORDER BY created_at DESC";
      params = ["manager", "staff", "user"];
    } else if (currentUserRole === "manager") {
      // Manager can see staff, user
      query += " WHERE role IN ($1, $2) ORDER BY created_at DESC";
      params = ["staff", "user"];
    } else if (currentUserRole === "staff") {
      // Staff can see user
      query += " WHERE role = $1 ORDER BY created_at DESC";
      params = ["user"];
    } else {
      // Regular users can't see other users
      return sendResponse(res, {
        success: false,
        message: "Access denied",
        statusCode: 403,
      });
    }

    const result = await db.query(query, params);
    return sendResponse(res, {
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const verifyToken = async (req, res) => {
  return sendResponse(res, {
    message: "Token is valid",
    data: {
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      exp: req.user.exp,
    },
  });
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return sendResponse(res, {
      message: "Logged out successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

// Delete user with role-based permissions
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserRole = req.user.role;

    // Get target user's role and image
    const targetUser = await db.query("SELECT role, image FROM users WHERE id = $1", [
      id,
    ]);

    if (targetUser.rows.length === 0) {
      return sendResponse(res, {
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    const { role: targetRole, image } = targetUser.rows[0];

    // Define role hierarchy and permissions
    const rolePermissions = {
      super_admin: ["admin", "manager", "staff", "user"],
      admin: ["manager", "staff", "user"],
      manager: ["staff", "user"],
      staff: ["user"],
    };

    // Check if current user can delete target user
    if (
      !rolePermissions[currentUserRole] ||
      !rolePermissions[currentUserRole].includes(targetRole)
    ) {
      return sendResponse(res, {
        success: false,
        message: "You don't have permission to delete this user",
        statusCode: 403,
      });
    }

    // Delete the user
    await db.query("DELETE FROM users WHERE id = $1", [id]);

    // Remove user image if exists
    if (image) {
      removeImg(image);
    }

    return sendResponse(res, {
      message: "User deleted successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};
