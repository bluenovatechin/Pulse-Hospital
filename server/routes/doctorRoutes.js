// ========================================================
// Pulse Hospital - Doctor Routes
// ========================================================

import { Router } from 'express';
import { getAllDoctorsHandler, getDoctorByIdHandler } from '../controllers/doctorController.js';

const router = Router();

router.get('/doctors', getAllDoctorsHandler);
router.get('/doctors/:id', getDoctorByIdHandler);

export default router;
