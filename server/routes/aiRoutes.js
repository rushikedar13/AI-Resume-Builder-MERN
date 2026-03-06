import express from "express";
import {
  enhanceJobDesc,
  enhanceProfessionalSummary,
  uploadResume,
  checkATSScore,
  tailorResume,
} from "../controllers/aiController.js";
import protect from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/tailor", protect, tailorResume);
router.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
router.post("/enhance-job-desc", protect, enhanceJobDesc);
router.post("/upload-resume", protect, uploadResume);
router.post("/check-ats", protect, checkATSScore);

export default router;
