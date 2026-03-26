import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  googleAuth,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// /api/auth/register - POST
router.post("/register", registerValidation, register);

// /api/auth/login - POST
router.post("/login", loginValidation, login);

// /api/auth/logout - POST
router.post("/logout", authUser, logout);

// /api/auth/me
router.get("/me", authUser, getMe);

// /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuth
);

export default router;
