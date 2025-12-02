import express from "express";
import {
  sendNotification,
  getUserNotifications,
  markRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", sendNotification);
router.get("/:userId", getUserNotifications);
router.put("/:id", markRead);

export default router;
