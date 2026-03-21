import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/update', verifyToken, authController.updateProfile);
router.delete('/delete', verifyToken, authController.deleteAccount);
router.get('/test', authController.test);

export default router;
