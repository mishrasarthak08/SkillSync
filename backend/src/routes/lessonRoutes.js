import express from "express";
import {
  addLesson,
  getLessonsByModule
} from "../controllers/lessonController.js";

const router = express.Router();

router.post("/:moduleId", addLesson);
router.get("/:moduleId", getLessonsByModule);

export default router;
