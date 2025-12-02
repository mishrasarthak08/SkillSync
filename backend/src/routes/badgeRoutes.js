import express from "express";
import {
  awardBadge,
  getUserBadges
} from "../controllers/badgeController.js";

const router = express.Router();

router.post("/:userId/:badgeId", awardBadge);
router.get("/:userId", getUserBadges);

export default router;
