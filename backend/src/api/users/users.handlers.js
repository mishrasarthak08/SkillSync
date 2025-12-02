import prisma from '../../config/prisma.js';

export const createUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    const user = await prisma.user.create({ data: { email, name } });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        progress: {
          include: {
            lesson: true
          }
        }
      }
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

export const getInterests = async (req, res) => {
  try {
    const interests = await prisma.interest.findMany();
    res.json(interests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, bio, interests } = req.body;

    let interestIds = [];
    if (interests && interests.length > 0) {
      interestIds = await Promise.all(interests.map(async (name) => {
        const interest = await prisma.interest.upsert({
          where: { name },
          update: {},
          create: { name }
        });
        return interest.id;
      }));
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        bio,
        interests: interestIds
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
