import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRoadmaps = async (req, res) => {
    try {
        const { page = 1, limit = 9, search = '', sort = 'newest' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        let orderBy = { createdAt: 'desc' };
        if (sort === 'oldest') orderBy = { createdAt: 'asc' };
        if (sort === 'name_asc') orderBy = { title: 'asc' };
        if (sort === 'name_desc') orderBy = { title: 'desc' };

        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [roadmaps, total] = await Promise.all([
            prisma.roadmap.findMany({
                where,
                include: {
                    skills: {
                        orderBy: { order: 'asc' }
                    },
                },
                skip,
                take,
                orderBy
            }),
            prisma.roadmap.count({ where })
        ]);

        let enhancedRoadmaps = roadmaps;
        if (req.user) {
            const userId = req.user.id;
            const userRoadmaps = await prisma.userRoadmap.findMany({
                where: { userId }
            });
            const userRoadmapMap = new Map(userRoadmaps.map(ur => [ur.roadmapId, ur.status]));

            enhancedRoadmaps = roadmaps.map(roadmap => {
                return {
                    ...roadmap,
                    status: userRoadmapMap.get(roadmap.id) || 'not_started'
                };
            });
        }

        res.json({
            data: enhancedRoadmaps,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roadmaps' });
    }
};

export const getRoadmapById = async (req, res) => {
    const { id } = req.params;
    try {
        const roadmap = await prisma.roadmap.findUnique({
            where: { id },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                    orderBy: {
                        order: 'asc',
                    }
                }
            }
        });

        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        let userSkills = [];
        let roadmapStatus = 'not_started';

        if (req.user) {
            userSkills = await prisma.userSkill.findMany({
                where: {
                    userId: req.user.id,
                    skillId: {
                        in: roadmap.skills.map(rs => rs.skillId)
                    }
                }
            });

            const userRoadmap = await prisma.userRoadmap.findFirst({
                where: {
                    userId: req.user.id,
                    roadmapId: id
                }
            });

            if (userRoadmap) {
                roadmapStatus = 'started';
            }
        }

        const enhancedSkills = roadmap.skills.map(rs => {
            const userSkill = userSkills.find(us => us.skillId === rs.skillId);
            return {
                ...rs,
                status: userSkill ? userSkill.status : 'not_started',
                locked: false
            };
        });

        if (roadmapStatus === 'not_started') {
            enhancedSkills.forEach(s => s.locked = true);
        } else {
            if (enhancedSkills.length > 0) enhancedSkills[0].locked = false;

            for (let i = 1; i < enhancedSkills.length; i++) {
                const prev = enhancedSkills[i - 1];
                if (prev.status !== 'completed') {
                    enhancedSkills[i].locked = true;
                }
            }
        }

        res.json({ ...roadmap, skills: enhancedSkills, status: roadmapStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roadmap details' });
    }
};

export const startRoadmap = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const roadmap = await prisma.roadmap.findUnique({
            where: { id },
            include: {
                skills: {
                    orderBy: { order: 'asc' },
                    take: 1
                }
            }
        });

        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        const existingRoadmap = await prisma.userRoadmap.findFirst({
            where: {
                userId,
                roadmapId: id
            }
        });

        if (!existingRoadmap) {
            await prisma.userRoadmap.create({
                data: {
                    userId,
                    roadmapId: id,
                    status: 'in_progress'
                }
            });
        }

        if (roadmap.skills.length > 0) {
            const firstSkillId = roadmap.skills[0].skillId;
            const existingSkill = await prisma.userSkill.findFirst({
                where: {
                    userId,
                    skillId: firstSkillId
                }
            });

            if (!existingSkill) {
                await prisma.userSkill.create({
                    data: {
                        userId,
                        skillId: firstSkillId,
                        status: 'in_progress',
                        startedAt: new Date()
                    }
                });
            }
        }

        res.json({ message: 'Roadmap started', status: 'started' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting roadmap', error: error.message });
    }
};
