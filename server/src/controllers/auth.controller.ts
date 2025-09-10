import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { config } from '../config';
import db from '../db';
import { registerSchema, loginSchema } from '../utils/validation';

// We no longer need to import AuthRequest because we modified the global Express Request type

/**
 * Register a new user
 * ROUTE: POST /api/auth/register
 */
export async function register(req: Request, res: Response) {
  // 1. Validate input
  try {
    registerSchema.parse(req.body);
  } catch (e: any) {
    return res.status(400).json({ error: e.errors[0].message });
  }

  const { name, email, password } = req.body;

  try {
    // 2. Hash password
    const hash = await bcrypt.hash(password, 12);

    // 3. Create user in database
    const newUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password_hash: hash,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // 4. Create JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ token, user: newUser });

  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return res.status(409).json({ error: 'Email is already in use' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * Log in an existing user
 * ROUTE: POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  // 1. Validate input
  try {
    loginSchema.parse(req.body);
  } catch (e: any) {
    return res.status(400).json({ error: e.errors[0].message });
  }

  const { email, password } = req.body;

  try {
    // 2. Find user by email
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // 5. Send token and user (safe data only)
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * Get the current authenticated user's profile
 * ROUTE: GET /api/auth/me
 */
// The parameter 'req' is now correctly typed as the standard Express 'Request'
export async function getMe(req: Request, res: Response) {
  // Because our middleware ran successfully, TypeScript now knows
  // that 'req.user' exists, thanks to our module augmentation.
  const userId = req.user?.id;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
}