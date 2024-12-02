import express from "express";
import {
  createCourse,
  getCourses,
  acceptTeacherRequestToJoinCourse,
  acceptAllTeachersJoinRequests,
  StudentsRequestsToJoinCourse,
  getAllStudentsInCourse,
  getAllTeachersInCourse,
} from "../controllers/course.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/getAll", protectRoute, getCourses);
router.get("/:id/getAll", protectRoute, getAllTeachersInCourse);
router.get("/:id/students", protectRoute, getAllStudentsInCourse);

router.post("/create", protectRoute, createCourse);
router.post(
  "/:id/acceptTeacher",
  protectRoute,
  acceptTeacherRequestToJoinCourse
);
router.post("/:id/requestToJoin", protectRoute, StudentsRequestsToJoinCourse);
router.post("/:id/accept", protectRoute, acceptTeacherRequestToJoinCourse);
router.post("/:id/accept/all", protectRoute, acceptAllTeachersJoinRequests);

export { router as courseRouter };
