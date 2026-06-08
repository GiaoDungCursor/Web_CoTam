import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev_secret_change_me',
  jwtAccessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as SignOptions['expiresIn'],
};
