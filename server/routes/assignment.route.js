import express from "express";
import {
  createAssignment,
  lockUnlockAssignment,
} from "../controllers/assignment.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();
router.post("/:id/create", protectRoute, createAssignment);
router.post("/:id/lockOrUnlock", protectRoute, lockUnlockAssignment);
export { router as assignmentRouter };
