import prisma from '../config/prisma.js';

export const addModule = async (req, res) => {
  try {
    const module = await prisma.module.create({
      data: {
        ...req.body,
        skillId: req.params.skillId
      }
    });
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getModulesBySkill = async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      where: { skillId: req.params.skillId },
      include: { lessons: true }
    });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
