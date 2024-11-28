import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongo from "./db/connectToMongo.js";
import { authRouter } from "./routes/auth.route.js";
import { courseRouter } from "./routes/course.route.js";

dotenv.config();
// constants
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`server listening on ${PORT}`);
});
