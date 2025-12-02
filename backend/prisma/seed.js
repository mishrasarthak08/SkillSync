import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    await prisma.lessonProgress.deleteMany();
    await prisma.userSkill.deleteMany();
    await prisma.roadmapSkill.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.roadmap.deleteMany();
    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.user.deleteMany();
    await prisma.interest.deleteMany();

    const interestsData = [
        'Frontend', 'Backend', 'Data Science', 'DevOps',
        'Design', 'Cloud Computing', 'Tools', 'Mobile Development'
    ];

    const interests = [];
    for (const name of interestsData) {
        const interest = await prisma.interest.create({ data: { name } });
        interests.push(interest);
    }

    const passwordHash = await bcrypt.hash('password123', 10);

    const userJordan = await prisma.user.create({
        data: {
            name: 'Jordan Smith',
            email: 'jordan@example.com',
            password: passwordHash,
            skillLevel: 'Intermediate',
            xp: 1450,
            interests: [interests[0].id, interests[4].id],
        },
    });

    console.log(`Created user: ${userJordan.name}`);

    const skillHTML = await prisma.skill.create({
        data: {
            name: 'HTML & CSS Fundamentals',
            description: 'Learn the building blocks of the web. Structure content with HTML and style it beautifully with CSS.',
            category: 'Frontend',
            difficulty: 'Beginner',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillJS = await prisma.skill.create({
        data: {
            name: 'JavaScript Core Concepts',
            description: 'Dive into the language of the web. Understand variables, functions, DOM manipulation, and asynchronous operations.',
            category: 'Frontend',
            difficulty: 'Intermediate',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillReact = await prisma.skill.create({
        data: {
            name: 'React.js Framework',
            description: 'Build modern, dynamic user interfaces with the most popular frontend library. Master components, state, and hooks.',
            category: 'Frontend',
            difficulty: 'Advanced',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillGit = await prisma.skill.create({
        data: {
            name: 'Version Control with Git',
            description: 'Learn to track changes in your code, collaborate with others, and manage projects effectively using Git and GitHub.',
            category: 'Tools',
            difficulty: 'Beginner',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillAdvancedReact = await prisma.skill.create({
        data: {
            name: 'Advanced React Patterns',
            description: 'Master component composition, hooks, and state management for scalable applications.',
            category: 'Frontend',
            difficulty: 'Advanced',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillDocker = await prisma.skill.create({
        data: {
            name: 'Docker for Developers',
            description: 'Learn to containerize your applications for consistent development and deployment.',
            category: 'DevOps',
            difficulty: 'Intermediate',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillDataScience = await prisma.skill.create({
        data: {
            name: 'Data Science with Python',
            description: 'Explore data analysis and machine learning using Pandas, NumPy, and Scikit-learn.',
            category: 'Data Science',
            difficulty: 'Intermediate',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillUIUX = await prisma.skill.create({
        data: {
            name: 'UI/UX Design Fundamentals',
            description: 'Understand user-centered design principles, wireframing, and prototyping.',
            category: 'Design',
            difficulty: 'Beginner',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillAWS = await prisma.skill.create({
        data: {
            name: 'AWS Cloud Practitioner',
            description: 'Grasp the fundamentals of the AWS cloud platform and its core services.',
            category: 'Cloud Computing',
            difficulty: 'Beginner',
            image: 'https://placehold.co/600x400'
        }
    });

    const skillNodeBackend = await prisma.skill.create({
        data: {
            name: 'Backend APIs with Node.js',
            description: 'Build robust and scalable RESTful APIs using the Express.js framework.',
            category: 'Backend',
            difficulty: 'Intermediate',
            image: 'https://placehold.co/600x400'
        }
    });

    const moduleJS1 = await prisma.module.create({
        data: {
            skillId: skillJS.id,
            title: 'Fundamentals',
            order: 1,
        }
    });

    await prisma.lesson.create({
        data: {
            moduleId: moduleJS1.id,
            title: 'Variables and Data Types',
            content: 'Introduction to let, const, var, and primitive types.',
            order: 1,
            difficulty: 'Beginner'
        }
    });

    await prisma.lesson.create({
        data: {
            moduleId: moduleJS1.id,
            title: 'Functions and Scope',
            content: 'Understanding function declarations, expressions, and arrow functions.',
            order: 2,
            difficulty: 'Beginner'
        }
    });

    const moduleJS2 = await prisma.module.create({
        data: {
            skillId: skillJS.id,
            title: 'Asynchronous JavaScript',
            order: 2,
        }
    });

    await prisma.lesson.create({
        data: {
            moduleId: moduleJS2.id,
            title: 'Introduction to Promises',
            content: 'Handling async operations with Promises.',
            order: 1,
            difficulty: 'Intermediate'
        }
    });

    await prisma.lesson.create({
        data: {
            moduleId: moduleJS2.id,
            title: 'Async/Await',
            content: 'Syntactic sugar for Promises.',
            order: 2,
            difficulty: 'Intermediate'
        }
    });

    const roadmapFullStack = await prisma.roadmap.create({
        data: {
            title: 'Full-Stack Web Developer',
            description: 'Master the entire web development process, from frontend interfaces to backend servers and databases. This path will equip you with the skills to build and deploy complete web applications.',
            estimatedTime: '6 months',
        }
    });

    const roadmapFrontend = await prisma.roadmap.create({
        data: {
            title: 'Frontend Specialist',
            description: 'Become an expert in user interfaces, mastering React, CSS, and modern JavaScript.',
            estimatedTime: '4 months',
        }
    });

    const roadmapDevOps = await prisma.roadmap.create({
        data: {
            title: 'DevOps Engineer',
            description: 'Bridge the gap between development and operations. Master Docker, AWS, and CI/CD pipelines.',
            estimatedTime: '5 months',
        }
    });

    const roadmapDataScience = await prisma.roadmap.create({
        data: {
            title: 'Data Scientist',
            description: 'Analyze complex data sets to drive decision-making. Master Python, Pandas, and Machine Learning.',
            estimatedTime: '8 months',
        }
    });

    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFullStack.id, skillId: skillHTML.id, order: 1 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFullStack.id, skillId: skillJS.id, order: 2 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFullStack.id, skillId: skillGit.id, order: 3 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFullStack.id, skillId: skillReact.id, order: 4 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFullStack.id, skillId: skillNodeBackend.id, order: 5 } });

    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFrontend.id, skillId: skillHTML.id, order: 1 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFrontend.id, skillId: skillJS.id, order: 2 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFrontend.id, skillId: skillReact.id, order: 3 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFrontend.id, skillId: skillAdvancedReact.id, order: 4 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapFrontend.id, skillId: skillUIUX.id, order: 5 } });

    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapDevOps.id, skillId: skillGit.id, order: 1 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapDevOps.id, skillId: skillDocker.id, order: 2 } });
    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapDevOps.id, skillId: skillAWS.id, order: 3 } });

    await prisma.roadmapSkill.create({ data: { roadmapId: roadmapDataScience.id, skillId: skillDataScience.id, order: 1 } });


    await prisma.userSkill.create({
        data: { userId: userJordan.id, skillId: skillHTML.id, status: 'completed', startedAt: new Date('2023-01-01') }
    });

    await prisma.userSkill.create({
        data: { userId: userJordan.id, skillId: skillJS.id, status: 'in_progress', startedAt: new Date('2023-02-01') }
    });

    await prisma.userSkill.create({
        data: { userId: userJordan.id, skillId: skillReact.id, status: 'in_progress', startedAt: new Date('2023-03-01') }
    });

    await prisma.userSkill.create({
        data: { userId: userJordan.id, skillId: skillNodeBackend.id, status: 'in_progress', startedAt: new Date('2023-04-01') }
    });

    await prisma.lessonProgress.create({
        data: { userId: userJordan.id, lessonId: (await prisma.lesson.findFirst({ where: { moduleId: moduleJS1.id, order: 1 } })).id, completed: true, completedAt: new Date() }
    });
    await prisma.lessonProgress.create({
        data: { userId: userJordan.id, lessonId: (await prisma.lesson.findFirst({ where: { moduleId: moduleJS1.id, order: 2 } })).id, completed: true, completedAt: new Date() }
    });

    const badgeCodeInitiate = await prisma.badge.create({
        data: {
            title: 'Code Initiate',
            icon: 'rocket_launch',
            description: 'Completed your first lesson'
        }
    });

    const badgeJSFundamentals = await prisma.badge.create({
        data: {
            title: 'JS Fundamentals',
            icon: 'code',
            description: 'Mastered JavaScript basics'
        }
    });

    await prisma.userBadge.create({
        data: {
            userId: userJordan.id,
            badgeId: badgeCodeInitiate.id
        }
    });

    await prisma.userBadge.create({
        data: {
            userId: userJordan.id,
            badgeId: badgeJSFundamentals.id
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
