import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';

// 1. IMPORT YOUR NEW ROUTER
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware setup
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(morgan('dev')); // Logger
app.use(express.json()); // Body parser for JSON

// This is our deployment health check route
app.get('/health', (_req, res) => res.json({ ok: true }));

// 2. USE YOUR NEW ROUTER
// All auth routes will now be prefixed with /api/auth
app.use('/api/auth', authRoutes);

export default app;