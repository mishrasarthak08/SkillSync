import express from "express";
import {
  markLesson
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/:userId/:lessonId", markLesson);

export default router;
