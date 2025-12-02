import express from "express";
import {
  enrollSkill,
  getUserSkills,
  updateUserSkill
} from "../controllers/userSkillController.js";

const router = express.Router();

router.post("/:skillId/:userId", enrollSkill);
router.get("/:userId", getUserSkills);
router.put("/:id", updateUserSkill);

export default router;
