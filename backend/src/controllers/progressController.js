import prisma from '../config/prisma.js';

export const markLesson = async (req, res) => {
  try {
    const { completed } = req.body;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: req.params.userId,
          lessonId: req.params.lessonId
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId: req.params.userId,
        lessonId: req.params.lessonId,
        completed
      }
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
