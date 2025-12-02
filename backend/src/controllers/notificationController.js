import prisma from '../config/prisma.js';

export const sendNotification = async (req, res) => {
  try {
    const noti = await prisma.notification.create({
      data: req.body
    });
    res.status(201).json(noti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.userId }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
