import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { ok, fail } from './lib/http.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { coursesRouter } from './modules/courses/courses.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/api/v1/health', (_req, res) => {
    res.json(ok({ status: 'healthy', service: 'edupro-api' }));
  });

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1', coursesRouter);
  app.use('/api/v1', ordersRouter);

  app.use((_req, res) => {
    res.status(404).json(fail('Không tìm thấy endpoint'));
  });

  return app;
};
