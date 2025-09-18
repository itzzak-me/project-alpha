import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';

// Import your route groups
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';

const app = express();

// Middleware setup
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(morgan('dev')); // Logger
app.use(express.json()); // Body parser for JSON

// This is our deployment health check route
app.get('/health', (_req, res) => res.json({ ok: true }));

// Connect your route groups to the main app
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;