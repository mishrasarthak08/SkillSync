import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSkills = async (req, res) => {
    try {
        const skills = await prisma.skill.findMany({
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                    orderBy: {
                        order: 'asc',
                    }
                }
            }
        });


        if (req.user) {
            const userId = req.user.id;
            const userSkills = await prisma.userSkill.findMany({
                where: { userId }
            });

            const userSkillsMap = new Map(userSkills.map(us => [us.skillId, us.status]));

            const enhancedSkills = skills.map(skill => ({
                ...skill,
                userStatus: userSkillsMap.get(skill.id) || 'not_enrolled'
            }));

            return res.json(enhancedSkills);
        }

        res.json(skills.map(skill => ({ ...skill, userStatus: 'not_enrolled' })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching skills' });
    }
};

export const getSkillById = async (req, res) => {
    const { id } = req.params;
    try {
        const skill = await prisma.skill.findUnique({
            where: { id },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                    orderBy: {
                        order: 'asc',
                    }
                },
                roadmaps: {
                    include: {
                        roadmap: true
                    }
                }
            }
        });

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        let userSkill = null;
        let lessonProgress = [];
        if (req.user) {
            userSkill = await prisma.userSkill.findFirst({
                where: {
                    userId: req.user.id,
                    skillId: id
                }
            });

            if (userSkill) {
                const allLessonIds = skill.modules.flatMap(m => m.lessons.map(l => l.id));
                lessonProgress = await prisma.lessonProgress.findMany({
                    where: {
                        userId: req.user.id,
                        lessonId: {
                            in: allLessonIds
                        }
                    }
                });
            }
        }

        const totalLessons = skill.modules.reduce((sum, m) => sum + m.lessons.length, 0);
        const completedLessons = lessonProgress.filter(lp => lp.completed).length;
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        const enhancedModules = skill.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson => {
                const progress = lessonProgress.find(lp => lp.lessonId === lesson.id);
                return {
                    ...lesson,
                    completed: progress ? progress.completed : false,
                    locked: false
                };
            })
        }));

        res.json({
            ...skill,
            modules: enhancedModules,
            userStatus: userSkill ? userSkill.status : 'not_enrolled',
            progressPercentage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching skill details' });
    }
};

export const completeLesson = async (req, res) => {
    const { id: skillId, lessonId } = req.params;
    const userId = req.user.id;

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            },
            update: { completed: true, completedAt: new Date() },
            create: { userId, lessonId, completed: true, completedAt: new Date() }
        });

        const skill = await prisma.skill.findUnique({
            where: { id: skillId },
            include: {
                modules: {
                    include: { lessons: true }
                }
            }
        });

        const allLessons = skill.modules.flatMap(m => m.lessons);
        const allLessonIds = allLessons.map(l => l.id);

        const completedCount = await prisma.lessonProgress.count({
            where: {
                userId,
                lessonId: { in: allLessonIds },
                completed: true
            }
        });

        let skillCompleted = false;
        let xpAwarded = 0;
        let badgesEarned = [];

        if (completedCount === allLessons.length) {
            skillCompleted = true;
            const userSkill = await prisma.userSkill.findUnique({
                where: { userId_skillId: { userId, skillId } }
            });

            if (userSkill && userSkill.status !== 'completed') {
                await prisma.userSkill.update({
                    where: { id: userSkill.id },
                    data: { status: 'completed', completedAt: new Date() }
                });

                const xpAmount = 500;
                await prisma.user.update({
                    where: { id: userId },
                    data: { xp: { increment: xpAmount } }
                });
                xpAwarded += xpAmount;

                let badge = await prisma.badge.findFirst({
                    where: { title: skill.name }
                });

                if (!badge) {
                    badge = await prisma.badge.create({
                        data: {
                            title: skill.name,
                            description: `Completed the ${skill.name} skill`,
                            icon: 'workspace_premium'
                        }
                    });
                }

                const existingBadge = await prisma.userBadge.findUnique({
                    where: { userId_badgeId: { userId, badgeId: badge.id } }
                });
                if (!existingBadge) {
                    await prisma.userBadge.create({
                        data: { userId, badgeId: badge.id }
                    });
                    badgesEarned.push(badge);
                }
            }
        }

        const roadmaps = await prisma.roadmap.findMany({
            where: {
                skills: {
                    some: { skillId }
                }
            },
            include: { skills: true }
        });

        for (const roadmap of roadmaps) {
            const roadmapSkillIds = roadmap.skills.map(rs => rs.skillId);
            const userCompletedSkillsCount = await prisma.userSkill.count({
                where: {
                    userId,
                    skillId: { in: roadmapSkillIds },
                    status: 'completed'
                }
            });

            if (userCompletedSkillsCount === roadmapSkillIds.length) {

                const bonusXP = 2000;
                await prisma.user.update({
                    where: { id: userId },
                    data: { xp: { increment: bonusXP } }
                });
                xpAwarded += bonusXP;


                const userRoadmap = await prisma.userRoadmap.findFirst({
                    where: {
                        userId,
                        roadmapId: roadmap.id
                    }
                });

                if (userRoadmap && userRoadmap.status !== 'completed') {
                    await prisma.userRoadmap.update({
                        where: { id: userRoadmap.id },
                        data: {
                            status: 'completed',
                            completedAt: new Date()
                        }
                    });
                }

                const roadmapBadgeTitle = `${roadmap.title} Master`;
                let roadmapBadge = await prisma.badge.findFirst({ where: { title: roadmapBadgeTitle } });

                if (!roadmapBadge) {
                    roadmapBadge = await prisma.badge.create({
                        data: {
                            title: roadmapBadgeTitle,
                            description: `Completed the ${roadmap.title} roadmap`,
                            icon: 'military_tech'
                        }
                    });
                }

                const existingRoadmapBadge = await prisma.userBadge.findUnique({
                    where: { userId_badgeId: { userId, badgeId: roadmapBadge.id } }
                });

                if (!existingRoadmapBadge) {
                    await prisma.userBadge.create({
                        data: { userId, badgeId: roadmapBadge.id }
                    });
                    badgesEarned.push(roadmapBadge);
                }
            }
        }

        res.json({
            message: 'Lesson completed',
            skillCompleted,
            xpAwarded,
            badgesEarned
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error completing lesson' });
    }
};

export const startSkill = async (req, res) => {
    const { id: skillId } = req.params;
    const userId = req.user.id;

    try {

        const existingEnrollment = await prisma.userSkill.findUnique({
            where: {
                userId_skillId: { userId, skillId }
            }
        });

        if (existingEnrollment) {
            return res.json({
                message: 'Already enrolled',
                status: existingEnrollment.status
            });
        }


        const userSkill = await prisma.userSkill.create({
            data: {
                userId,
                skillId,
                status: 'in_progress'
            }
        });

        res.json({
            message: 'Skill started successfully',
            status: userSkill.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting skill' });
    }
};

export const leaveSkill = async (req, res) => {
    const { id: skillId } = req.params;
    const userId = req.user.id;

    try {
        await prisma.userSkill.delete({
            where: {
                userId_skillId: { userId, skillId }
            }
        });

        res.json({ message: 'Successfully left the skill' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error leaving skill' });
    }
};
