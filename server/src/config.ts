import dotenv from 'dotenv';
dotenv.config(); // This command loads the .env file

// This object exports all our environment variables [cite: 30]
export const config = {
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  stripeSecret: process.env.STRIPE_SECRET_KEY!,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
