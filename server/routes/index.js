// ========================================================
// Pulse Hospital - Master API Router
// Combines all feature routes under /api
// ========================================================

import { Router } from 'express';
import appointmentRoutes from './appointmentRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import hospitalRoutes from './hospitalRoutes.js';
import contactRoutes from './contactRoutes.js';
import adminRoutes from './adminRoutes.js';

const apiRouter = Router();

// Mount all feature routes
apiRouter.use('/', hospitalRoutes);
apiRouter.use('/', doctorRoutes);
apiRouter.use('/', appointmentRoutes);
apiRouter.use('/', contactRoutes);
apiRouter.use('/', adminRoutes);

export default apiRouter;
