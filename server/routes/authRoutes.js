import express from "express";
import passport from "passport";
import { generateTokenAndSetCookie } from "../lib/jwtAuth.js";

const router = express.Router();

// Route to trigger Google Login

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    generateTokenAndSetCookie(req.user._id, res);
    res.redirect("/profile"); // Replace with your client URL
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/fail", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Failed to authenticate with Google",
  });
});
// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3001/auth/fail",
    successRedirect: "/profile",
  }),
  (req, res) => {
    generateTokenAndSetCookie(req.user._id, res);
    res.redirect("/profile"); // Replace with your client URL
  }
);

export default router;
