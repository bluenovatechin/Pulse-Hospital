// ========================================================
// Pulse Hospital - Contact Routes
// ========================================================

import { Router } from 'express';
import { submitContactHandler } from '../controllers/contactController.js';

const router = Router();

router.post('/contact', submitContactHandler);

export default router;
