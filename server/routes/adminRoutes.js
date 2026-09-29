// ========================================================
// Pulse Hospital - Staff Admin Routes
// ========================================================

import { Router } from 'express';
import {
  getAdminAppointmentsHandler,
  updateAppointmentStatusHandler,
  getAdminStatsHandler
} from '../controllers/adminController.js';
import requireStaffKey from '../middleware/requireStaffKey.js';

const router = Router();

router.get('/admin/appointments', requireStaffKey, getAdminAppointmentsHandler);
router.patch('/admin/appointments/:id/status', requireStaffKey, updateAppointmentStatusHandler);
router.get('/admin/stats', requireStaffKey, getAdminStatsHandler);

export default router;
