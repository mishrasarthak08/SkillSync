import prisma from '../config/prisma.js';

export const createSkill = async (req, res) => {
  try {
    const skill = await prisma.skill.create({
      data: req.body
    });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      include: { modules: true }
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSkillById = async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
      include: { modules: true }
    });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const updated = await prisma.skill.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
