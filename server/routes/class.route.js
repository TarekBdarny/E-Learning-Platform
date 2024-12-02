import express from "express";
import {
  acceptStudentRequest,
  createClass,
  getAllMyClasses,
  getAllStudentsInClass,
  getPendingRequestsToJoin,
  inviteStudentToClass,
  rejectStudentRequest,
  removeStudentFromClass,
} from "../controllers/class.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:id/pending/requests", protectRoute, getPendingRequestsToJoin);
router.get("/:id/all/students", protectRoute, getAllStudentsInClass);
router.get("/my/classes", protectRoute, getAllMyClasses);

router.post("/create/class", protectRoute, createClass);
router.post("/:id/accept/student", protectRoute, acceptStudentRequest);
router.post("/:id/reject/student", protectRoute, rejectStudentRequest);
router.post("/:id/invite/student", protectRoute, inviteStudentToClass);

router.delete("/:id/remove/student", protectRoute, removeStudentFromClass);

export { router as classRouter };
