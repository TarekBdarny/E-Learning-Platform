import express from "express";
import {
  login,
  register,
  logout,
  verifyEmail,
  promoteRole,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/verify", verifyEmail);
router.patch("/promote", protectRoute, promoteRole);
export { router as authRouter };
