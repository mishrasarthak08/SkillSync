import express from "express";

import skillRoutes from "./skillRoutes.js";
import moduleRoutes from "./moduleRoutes.js";
import lessonRoutes from "./lessonRoutes.js";
import userSkillRoutes from "./userSkillRoutes.js";
import progressRoutes from "./progressRoutes.js";
import commentRoutes from "./commentRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import badgeRoutes from "./badgeRoutes.js";

const router = express.Router();

router.use("/skills", skillRoutes);
router.use("/modules", moduleRoutes);
router.use("/lessons", lessonRoutes);
router.use("/user-skills", userSkillRoutes);
router.use("/progress", progressRoutes);
router.use("/comments", commentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/badges", badgeRoutes);

export default router;