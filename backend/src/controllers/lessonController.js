import prisma from '../config/prisma.js';

export const addLesson = async (req, res) => {
  try {
    const lesson = await prisma.lesson.create({
      data: {
        ...req.body,
        moduleId: req.params.moduleId
      }
    });
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLessonsByModule = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId: req.params.moduleId }
    });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
