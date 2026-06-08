import type { NextFunction, Request, Response } from 'express';
import { fail } from '../lib/http.js';
import { verifyAccessToken } from '../lib/auth.js';
import type { AuthUser, Role } from '../types.js';

declare module 'express-serve-static-core' {
  interface Request {
    authUser?: AuthUser;
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';

  if (!token) {
    res.status(401).json(fail('Bạn cần đăng nhập để thực hiện thao tác này'));
    return;
  }

  try {
    req.authUser = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json(fail('Phiên đăng nhập không hợp lệ hoặc đã hết hạn'));
  }
};

export const requireRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      res.status(401).json(fail('Bạn cần đăng nhập để thực hiện thao tác này'));
      return;
    }

    if (!roles.includes(req.authUser.role)) {
      res.status(403).json(fail('Bạn không có quyền thực hiện thao tác này'));
      return;
    }

    next();
  };
};
