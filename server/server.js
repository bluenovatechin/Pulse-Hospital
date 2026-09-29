// ========================================================
// Pulse Hospital & I.C.U - Backend Entry Point
// Clean, standard Express server architecture
// ========================================================

import './loadEnv.js'; // must stay first: loads server/.env before other modules read it
import express from 'express';
import cors from 'cors';
import { SERVER_CONFIG } from './config/constants.js';
import apiRouter from './routes/index.js';

const app = express();

// Middlewares
// CORS_ORIGIN: comma-separated list of allowed website origins ('*' = any)
const allowedOrigins = SERVER_CONFIG.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start Server
app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`===============================================`);
  console.log(`🏥 Pulse Hospital & I.C.U API Server`);
  console.log(`🚀 Port: ${SERVER_CONFIG.PORT}`);
  console.log(`📱 WhatsApp Testing Number: +91 63533 44875`);
  console.log(`===============================================`);
});

export default app;
