import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, getInterests } from './users.handlers.js';

const router = express.Router();

router.get('/interests', getInterests);
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
