// ========================================================
// Pulse Hospital - Appointment Routes
// ========================================================

import { Router } from 'express';
import {
  getNextWeekScheduleHandler,
  getSlotsHandler,
  createAppointmentHandler,
  getAppointmentByIdHandler,
  lookupAppointmentsHandler,
  cancelAppointmentHandler
} from '../controllers/appointmentController.js';

const router = Router();

// Schedule & Slot Queries
router.get('/next-week-schedule', getNextWeekScheduleHandler);
router.get('/slots', getSlotsHandler);

// Appointment Actions
router.post('/appointments', createAppointmentHandler);
router.get('/appointments-lookup', lookupAppointmentsHandler);
router.get('/appointments/:id', getAppointmentByIdHandler);
router.patch('/appointments/:id/cancel', cancelAppointmentHandler);

export default router;
