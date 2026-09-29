// ========================================================
// Pulse Hospital - Hospital Metadata & Health Routes
// ========================================================

import { Router } from 'express';
import { getHealthHandler, getHospitalInfoHandler } from '../controllers/hospitalController.js';

const router = Router();

router.get('/health', getHealthHandler);
router.get('/hospital-info', getHospitalInfoHandler);

export default router;
