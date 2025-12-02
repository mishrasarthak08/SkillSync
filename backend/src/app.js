import express from 'express';
import cors from 'cors';
import authRoutes from './api/auth/auth.routes.js';
import usersRoutes from './api/users/users.routes.js';
import roadmapsRoutes from './api/roadmaps/roadmaps.routes.js';
import skillsRoutes from './api/skills/skills.routes.js';
import dashboardRoutes from './api/dashboard/dashboard.routes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roadmaps', authenticateToken, roadmapsRoutes);
app.use('/api/skills', authenticateToken, skillsRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

export default app;
