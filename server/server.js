import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import passport from "passport";
import connectToMongo from "./db/connectToMongo.js";
import { authRouter } from "./routes/auth.route.js";
import { courseRouter } from "./routes/course.route.js";
import router from "./routes/authRoutes.js"; // Import auth routes
import "./config/passportConfig.js"; // Import the passport configuration
import "./config/jwtStrategy.js";
import { protectRoute } from "./middlewares/protectRoute.js";
// configuration
dotenv.config();

// constants
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());

app.use("/auth", router);

// middlewares

app.get("/", (req, res) => {
  res.send(
    "<a href='/auth/github'>Login with Github</a> <a href='/auth/google'>Login with Google</a>"
  );
});

app.get("/profile", protectRoute, (req, res) => {
  console.log(req.user);
  res.send(`Hello, ${req.user.userId}!`);
});
// routes
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);

app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`server listening on ${PORT}`);
});
