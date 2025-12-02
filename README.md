# Project Proposal
# SkillSync – Peer Learning & Skill Development Platform

**Deployed Links:**
- **Frontend:** [https://skill-sync-ten-smoky.vercel.app/dashboard](https://skill-sync-ten-smoky.vercel.app/dashboard)
- **Backend:** [https://dynamic-illumination-production.up.railway.app](https://dynamic-illumination-production.up.railway.app)

---

## 1. Problem Statement
Self-directed learning can often feel unstructured and isolating. Students and professionals struggle to find clear learning paths (roadmaps), track their progress effectively, and stay motivated without a gamified or community-driven environment. SkillSync solves this by providing a structured platform where users can enroll in skills, follow guided roadmaps, track their progress through lessons, and earn rewards (XP and Badges) — creating a dynamic ecosystem for continuous skill development.

## 2. System Architecture
**Frontend → Backend (API) → Database**

- **Frontend:** React.js (Vite) with React Router for navigation, Tailwind CSS for styling.
- **Backend:** Node.js + Express.js (REST API architecture).
- **Database:** MongoDB (managed via MongoDB Atlas), accessed via Prisma ORM.
- **Authentication:** JWT-based secure login/signup.
- **Hosting:** 
  - Frontend → Vercel
  - Backend → Railway
  - Database → MongoDB Atlas

## 3. Core Functionalities

### Authentication & Authorization
- JWT-based login and signup.
- Secure session handling and protected routes.

### User Profiles & Gamification
- **Profile Management:** Users can update their personal details, bio, and interests.
- **Gamification:** Users earn **XP** (Experience Points) for completing lessons and roadmaps.
- **Badges:** Automated badge awarding system (e.g., "Scholar", "Achiever") based on progress.
- **Dashboard:** Visual display of current level, total XP, skills mastered, and recent activity.

### Skills & Roadmaps
- **Skill Exploration:** Browse and search for skills (e.g., React, Python, Node.js) with advanced filtering and sorting.
- **Roadmaps:** Structured learning paths combining multiple skills (e.g., "Full Stack Developer").
- **Enrollment:** One-click enrollment in skills and roadmaps.
- **Management:** Ability to leave skills if no longer interested.

### Learning System
- **Modules & Lessons:** Structured content delivery with video/text lessons.
- **Progress Tracking:** Mark lessons as complete, visual progress bars for skills and roadmaps.
- **Auto-Enrollment:** Starting a roadmap automatically enrolls the user in all required skills.

### Theme & UI
- **Dark/Light Mode:** Fully responsive theme toggle.
- **Responsive Design:** Optimized for desktop and mobile devices.

## 4. CRUD Operations Using APIs
SkillSync implements full CRUD capabilities through RESTful API endpoints:
- **Create:** User signup, Enroll in Skill/Roadmap, Complete Lesson.
- **Read:** View Profile, List Skills/Roadmaps (with pagination/search), View Details.
- **Update:** Edit Profile (Bio, Interests), Update Progress.
- **Delete:** Delete User Account, Leave Skill (Unenroll).

## 5. Advanced Data Handling
To ensure efficient data retrieval and performance:
- **Server-Side Pagination:** Efficiently handles large datasets for Skills and Roadmaps.
- **Backend Search & Filtering:** Database-level search by name/description and filtering by category.
- **Sorting:** Sort skills by Newest, Oldest, or Name (A-Z/Z-A).
- **Cascading Deletes:** Robust database schema ensures clean removal of user data (Skills, Progress, Badges) upon account deletion.
- **Relations:** Efficient handling of complex relationships (User -> Enrollments -> Skills -> Lessons) using Prisma ORM.
- **Aggregations:** Calculating total XP, completed lessons, and badge eligibility dynamically.

## 6. Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **ORM** | Prisma |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

## 7. API Overview
Key endpoints include:
- `POST /api/auth/login` & `/register`
- `GET /api/dashboard` (User stats, progress)
- `GET /api/skills?page=1&limit=9&search=react` (Listing with pagination/search)
- `GET /api/roadmaps?page=1&search=fullstack` (Listing with pagination/search)
- `GET /api/skills/:id` (Details & Modules)
- `POST /api/skills/:id/start` (Enrollment)
- `DELETE /api/skills/:id/enrollment` (Leave Skill)
- `POST /api/skills/:skillId/lessons/:lessonId/complete` (Progress update)
- `PUT /api/users/:id` (Profile update)
- `DELETE /api/users/:id` (Delete Account)

## 8. Implementation Workflow
1.  **Frontend (React):** Fetches data using `fetch` API; manages state with `useState`/`useEffect` and Context API (AuthContext).
2.  **Backend (Node + Express):** Defines REST routes; uses Controllers/Handlers for logic and Prisma Client for database interactions.
3.  **Database (MongoDB):** Stores Users, Skills, Roadmaps, Lessons, and Progress in a relational-like document structure defined in `schema.prisma`.
4.  **Testing:** Manual testing of flows (Enrollment -> Completion -> XP Award -> Badge Unlock).

## 9. Future Scope
- **Peer Chat:** Real-time communication using Socket.io.
- **AI Recommendations:** Suggesting skills based on user interests and current progress.
- **Community Projects:** Collaborative project boards for students to build together.

## 10. Expected Outcomes
A robust, full-stack learning platform that not only delivers content but actively motivates users through gamification and clear progress visualization, ensuring a higher completion rate compared to static learning sites.

## 11. Conclusion
With its structured roadmaps, gamified progress system, and seamless full-stack architecture, SkillSync provides a production-grade environment for skill development. It successfully transforms individual learning into an engaging, tracked, and rewarding experience.
