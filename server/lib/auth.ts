import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthUser, User } from '../types.js';

export const toPublicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const signAccessToken = (user: User) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn },
  );

export const verifyAccessToken = (token: string): AuthUser => {
  const payload = jwt.verify(token, env.jwtAccessSecret) as jwt.JwtPayload;

  return {
    id: String(payload.sub),
    email: String(payload.email),
    role: payload.role as AuthUser['role'],
  };
};
