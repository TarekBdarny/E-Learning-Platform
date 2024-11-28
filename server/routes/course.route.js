import express from "express";
import {
  addStudentToCourse,
  createCourse,
  getCourses,
} from "../controllers/course.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/create", protectRoute, createCourse);
router.get("/getAll", protectRoute, getCourses);
router.post("/addStudent/:id", protectRoute, addStudentToCourse);

export { router as courseRouter };
