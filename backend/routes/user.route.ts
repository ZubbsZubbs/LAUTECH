import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers as any);
router.get('/:id', getUserById as any);

export default router;
