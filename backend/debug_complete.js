import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugCompleteButton() {
    console.log('=== Debugging Complete Button ===\n');

    // 1. Check if there are any users
    const users = await prisma.user.findMany();
    console.log(`1. Total users: ${users.length}`);
    if (users.length > 0) {
        console.log(`   First user: ${users[0].email}`);
    }

    // 2. Check if there are any skills
    const skills = await prisma.skill.findMany({
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });
    console.log(`\n2. Total skills: ${skills.length}`);
    if (skills.length > 0) {
        const skill = skills[0];
        console.log(`   First skill: ${skill.name}`);
        console.log(`   Modules: ${skill.modules.length}`);
        console.log(`   Total lessons: ${skill.modules.reduce((sum, m) => sum + m.lessons.length, 0)}`);
    }

    // 3. Check if users are enrolled in any skills
    const userSkills = await prisma.userSkill.findMany({
        include: {
            user: true,
            skill: true
        }
    });
    console.log(`\n3. Total user-skill enrollments: ${userSkills.length}`);
    if (userSkills.length > 0) {
        userSkills.forEach((us, i) => {
            console.log(`   ${i + 1}. ${us.user.email} enrolled in "${us.skill.name}" - Status: ${us.status}`);
        });
    } else {
        console.log('   ⚠️  No users are enrolled in any skills!');
        console.log('   To enroll a user, you need to start a skill from the UI or run:');
        console.log('   await prisma.userSkill.create({ data: { userId: "USER_ID", skillId: "SKILL_ID", status: "in_progress" } })');
    }

    // 4. Check lesson progress
    const lessonProgress = await prisma.lessonProgress.findMany({
        include: {
            user: true,
            lesson: true
        }
    });
    console.log(`\n4. Total lesson progress records: ${lessonProgress.length}`);
    if (lessonProgress.length > 0) {
        lessonProgress.slice(0, 5).forEach((lp, i) => {
            console.log(`   ${i + 1}. ${lp.user.email} - Lesson: ${lp.lesson.title} - Completed: ${lp.completed}`);
        });
    }

    // 5. Check badges
    const badges = await prisma.badge.findMany();
    console.log(`\n5. Total badges: ${badges.length}`);
    if (badges.length > 0) {
        badges.slice(0, 5).forEach((badge, i) => {
            console.log(`   ${i + 1}. ${badge.title} - ${badge.icon}`);
        });
    }

    console.log('\n=== Debug Complete ===');
}

debugCompleteButton()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
