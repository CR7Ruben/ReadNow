import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import * as usersController from '../controllers/users.controller.js';

const router = Router();

router.put('/update-role/:id_usuario', verifyToken, usersController.updateRole);
router.put('/save-card-data/:id_usuario', verifyToken, usersController.saveCardData);
router.get('/debug', usersController.getAllUsers);

export default router;
