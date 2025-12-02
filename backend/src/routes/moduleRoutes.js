import express from "express";
import {
  addModule,
  getModulesBySkill
} from "../controllers/moduleController.js";

const router = express.Router();

router.post("/:skillId", addModule);
router.get("/:skillId", getModulesBySkill);

export default router;
