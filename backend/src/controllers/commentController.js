import prisma from '../config/prisma.js';


export const addComment = async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: req.body
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { skillId: req.params.skillId },
      include: { user: true }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
