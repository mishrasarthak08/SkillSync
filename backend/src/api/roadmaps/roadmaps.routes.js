import { Router } from 'express';
import * as roadmapHandlers from './roadmaps.handlers.js';

const router = Router();

router.get('/', roadmapHandlers.getAllRoadmaps);
router.get('/:id', roadmapHandlers.getRoadmapById);
router.post('/:id/start', roadmapHandlers.startRoadmap);

export default router;
