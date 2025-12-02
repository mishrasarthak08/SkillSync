import { Router } from 'express';
import * as dashboardHandlers from './dashboard.handlers.js';

const router = Router();

router.get('/', dashboardHandlers.getDashboardSummary);

export default router;
