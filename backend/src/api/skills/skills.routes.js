import { Router } from 'express';
import * as skillHandlers from './skills.handlers.js';

const router = Router();

router.get('/', skillHandlers.getAllSkills);
router.get('/:id', skillHandlers.getSkillById);
router.post('/:id/start', skillHandlers.startSkill);
router.post('/:id/lessons/:lessonId/complete', skillHandlers.completeLesson);

export default router;
