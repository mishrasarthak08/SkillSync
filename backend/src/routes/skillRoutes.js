import express from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill
} from "../controllers/skillController.js";

const router = express.Router();

router.post("/", createSkill);
router.get("/", getAllSkills);
router.get("/:id", getSkillById);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
