import { Router } from 'express';
import * as dbController from '../controllers/db.controller.js';

const router = Router();

router.get('/check-usuarios', dbController.checkUsuarios);
router.post('/migrate-passwords', dbController.migratePasswords);
router.post('/verify-db', dbController.verifyDb);
router.get('/check-card-columns', dbController.checkCardColumns);
router.get('/create-lectura-table', dbController.createLecturaTable);

export default router;
