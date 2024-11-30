import userModel from "../db/models/user.model.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { generateTokenAndSetCookie } from "../lib/jwtAuth.js";
import { mailer } from "../lib/mailer.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }
    const isEmailVerified = user.isVerified;

    if (!isEmailVerified) {
      return res.status(404).json({
        message: "Email not verified. Please verify your email first.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    generateTokenAndSetCookie(user._id, res);
    delete user.password;

    res.status(200).json({ message: "Logged In Successfully", data: user });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const colors = [
      "000",
      "6ab04c",
      "f39c12 ",
      "ff6b6b",
      "68A691",
      "694F5D",
      "9fbfc8",
      "fef65b",
      "588163",
    ];
    let avatarWithInitialsUrl = `https://avatar.oxro.io/avatar.svg?name=${firstName}+${lastName}&background=${
      colors[Math.floor(Math.random() * colors.length)]
    }&caps=3&bold=true`;
    const generatedUsername = `${firstName}${lastName}#${generateVerificationToken()}`;
    const verificationToken = generateVerificationToken();
    const newUser = new userModel({
      username: generatedUsername,
      firstName,
      lastName,
      userId: uuid(),
      email,
      password: hashedPassword,
      avatar: avatarWithInitialsUrl,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
    }
    const userWithoutPassword = { ...newUser, password: "" };

    // Send verification email to new user and verification token
    mailer(email, "verification", verificationToken);

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;

  try {
    const user = await userModel.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification Token " });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await mailer(user.email, "greeting", `${user.firstName} ${user.lastName}`);
    res.status(200).json({
      message: "Email verified successfully",
      data: {
        ...user._doc,
        password: "undefined",
      },
    });
  } catch (error) {
    console.log("error in verifyEmail controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const promoteRole = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Teacher") {
      return res
        .status(400)
        .json({ message: "Promotion Denied, You are already a teacher" });
    }
    user.role = "Teacher";
    await user.save();
    res.status(200).json({
      message: "User promoted to Teacher",
      data: {
        ...user._doc,
        password: "undefined",
      },
    });
  } catch (error) {
    console.log("error in promoteRole controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
