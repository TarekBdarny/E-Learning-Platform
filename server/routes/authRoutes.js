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
    console.log("github callbakc : ", req.user);
    generateTokenAndSetCookie(req.user._id, res);
    // const token = req.user.generateJWT();
    // res.cookie("jwt", token);
    res.redirect("/profile"); // Replace with your client URL
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log("google callbakc : ", req.user);
    generateTokenAndSetCookie(req.user._id, res);
    // const token = req.user.generateJWT();
    // res.cookie("jwt", token);
    res.redirect("/profile"); // Replace with your client URL
  }
);

export default router;
