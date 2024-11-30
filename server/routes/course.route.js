import express from "express";
import {
  acceptAllJoinRequests,
  acceptRequestToJoinCourse,
  addStudentToCourse,
  createCourse,
  getAllStudentsInCourse,
  getCourses,
  requestToJoinCourse,
} from "../controllers/course.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/create", protectRoute, createCourse);
router.get("/getAll", protectRoute, getCourses);
router.post("/addStudent/:id", protectRoute, addStudentToCourse);
router.post("/:id/requestToJoin", protectRoute, requestToJoinCourse);
router.post("/:id/accept", protectRoute, acceptRequestToJoinCourse);
router.post("/:id/accept/all", protectRoute, acceptAllJoinRequests);
router.get("/:id/students", protectRoute, getAllStudentsInCourse);

export { router as courseRouter };
