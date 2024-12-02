import { Router } from "express";
import {
  createSubmission,
  gradeSubmission,
} from "../controllers/submission.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router.post("/:id/create", protectRoute, createSubmission);
router.post("/:id/grade/submission", protectRoute, gradeSubmission);

export { router as submissionRouter };
