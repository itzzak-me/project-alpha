import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

// This is "module augmentation."
// We are telling TypeScript to add our custom 'user' property to the
// existing 'Request' type from the Express library.
declare global {
  namespace Express {
    export interface Request {
      user?: { id: string; role: string };
    }
  }
}

/**
 * Middleware to verify a JWT and attach the user payload to the request.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
    req.user = payload; // Now TypeScript knows this is valid
    next();
  } catch (error) { // We must catch the error object
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware (run AFTER requireAuth) to check if the user is an admin.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // We use optional chaining '?' just in case, but this middleware
  // should always run AFTER requireAuth has added the req.user object.
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}