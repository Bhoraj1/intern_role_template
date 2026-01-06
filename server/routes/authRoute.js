import express from "express";
import {
  register,
  login,
  getAllUsers,
  verifyToken,
  deleteUser,
  logout,
} from "../controllers/authController.js";
import { isLogin } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { serviceImgUpload } from "../utils/multerHandler.js";

const authRouter = express.Router();

authRouter.post("/register", serviceImgUpload.single("image"), register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/verify", isLogin, verifyToken);
authRouter.get(
  "/users",
  isLogin,
  authorizeRoles("super_admin", "admin", "manager", "staff"),
  getAllUsers
);
authRouter.delete(
  "/users/:id",
  isLogin,
  authorizeRoles("super_admin", "admin", "manager", "staff"),
  deleteUser
);

export default authRouter;
