import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardSummary = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                },
                badges: {
                    include: {
                        badge: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const ongoingSkillsData = user.skills.filter(us => us.status === 'in_progress');

        const ongoingCourses = await Promise.all(
            ongoingSkillsData.map(async (userSkill) => {
                const skill = await prisma.skill.findUnique({
                    where: { id: userSkill.skillId },
                    include: {
                        modules: {
                            include: {
                                lessons: true
                            }
                        }
                    }
                });

                const totalLessons = skill.modules.reduce((sum, m) => sum + m.lessons.length, 0);
                const allLessonIds = skill.modules.flatMap(m => m.lessons.map(l => l.id));

                const completedLessons = await prisma.lessonProgress.count({
                    where: {
                        userId: userId,
                        lessonId: { in: allLessonIds },
                        completed: true
                    }
                });

                const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return {
                    id: skill.id,
                    name: skill.name,
                    image: skill.image,
                    category: skill.category,
                    progress: progressPercentage
                };
            })
        );

        const userRoadmaps = await prisma.userRoadmap.findMany({
            where: {
                userId: userId,
                status: 'in_progress'
            },
            include: {
                roadmap: {
                    include: { skills: true }
                }
            }
        });

        const userCompletedSkillIds = new Set(user.skills.filter(us => us.status === 'completed').map(us => us.skillId));

        const incompleteRoadmaps = userRoadmaps.map(ur => {
            const roadmap = ur.roadmap;
            const skillIds = roadmap.skills.map(s => s.skillId);
            const completedCount = skillIds.filter(id => userCompletedSkillIds.has(id)).length;
            const progress = skillIds.length > 0 ? Math.round((completedCount / skillIds.length) * 100) : 0;

            return {
                id: roadmap.id,
                name: roadmap.title,
                description: roadmap.description,
                progress
            };
        });

        const earnedBadges = user.badges.map(ub => ({
            title: ub.badge.title,
            icon: ub.badge.icon,
            description: ub.badge.description,
            awardedAt: ub.awardedAt
        }));

        let recommendedCourses = [];
        let userInterestNames = [];
        if (user.interests && user.interests.length > 0) {
            const interests = await prisma.interest.findMany({
                where: {
                    id: { in: user.interests }
                }
            });
            userInterestNames = interests.map(i => i.name);

            const enrolledSkillIds = user.skills.map(us => us.skillId);

            recommendedCourses = await prisma.skill.findMany({
                where: {
                    category: { in: userInterestNames },
                    id: { notIn: enrolledSkillIds }
                },
                take: 3
            });
        }

        if (recommendedCourses.length < 3) {
            const enrolledSkillIds = user.skills.map(us => us.skillId);
            const existingRecommendedIds = recommendedCourses.map(rc => rc.id);
            const excludeIds = [...enrolledSkillIds, ...existingRecommendedIds];

            const additionalCourses = await prisma.skill.findMany({
                where: {
                    id: { notIn: excludeIds }
                },
                take: 3 - recommendedCourses.length
            });

            recommendedCourses = [...recommendedCourses, ...additionalCourses];
        }

        const skillsMastered = user.skills.filter(us => us.status === 'completed').length;
        const lessonsCompletedCount = await prisma.lessonProgress.count({
            where: {
                userId: userId,
                completed: true
            }
        });

        res.json({
            user: {
                name: user.name,
                email: user.email,
                xp: user.xp,
                skillLevel: user.skillLevel || 'Beginner',
                interests: userInterestNames,
                skillsMastered,
                lessonsCompleted: lessonsCompletedCount
            },
            ongoingCourses,
            incompleteRoadmaps,
            recommendedCourses,
            badges: earnedBadges
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard summary' });
    }
};
