import prisma from '../config/prisma.js';

export const awardBadge = async (req, res) => {
  try {
    const userBadge = await prisma.userBadge.create({
      data: {
        userId: req.params.userId,
        badgeId: req.params.badgeId
      }
    });
    res.status(201).json(userBadge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBadges = async (req, res) => {
  try {
    const badges = await prisma.userBadge.findMany({
      where: { userId: req.params.userId },
      include: { badge: true }
    });
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
