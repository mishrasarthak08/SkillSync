import prisma from '../config/prisma.js';

export const enrollSkill = async (req, res) => {
  try {
    const enrollment = await prisma.userSkill.create({
      data: {
        userId: req.params.userId,
        skillId: req.params.skillId,
        status: "enrolled"
      }
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserSkills = async (req, res) => {
  try {
    const skills = await prisma.userSkill.findMany({
      where: { userId: req.params.userId },
      include: { skill: true }
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserSkill = async (req, res) => {
  try {
    const updated = await prisma.userSkill.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
