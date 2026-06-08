import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../data/store.js';
import { requireAuth } from '../../middleware/auth.js';
import { ok, fail } from '../../lib/http.js';
import { signAccessToken, toPublicUser } from '../../lib/auth.js';
import type { User } from '../../types.js';

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(fail('Dữ liệu đăng ký không hợp lệ', parsed.error.issues));
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const existedUser = store.users.find((user) => user.email === email);

  if (existedUser) {
    res.status(409).json(fail('Email đã được sử dụng'));
    return;
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email,
    passwordHash: await bcrypt.hash(parsed.data.password, 10),
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);

  res.status(201).json(
    ok({
      accessToken: signAccessToken(user),
      user: toPublicUser(user),
    }, 'Đăng ký thành công'),
  );
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(fail('Dữ liệu đăng nhập không hợp lệ', parsed.error.issues));
    return;
  }

  const user = store.users.find((item) => item.email === parsed.data.email.toLowerCase());

  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    res.status(401).json(fail('Email hoặc mật khẩu không đúng'));
    return;
  }

  res.json(
    ok({
      accessToken: signAccessToken(user),
      user: toPublicUser(user),
    }, 'Đăng nhập thành công'),
  );
});

authRouter.get('/me', requireAuth, (req, res) => {
  const user = store.users.find((item) => item.id === req.authUser?.id);

  if (!user) {
    res.status(404).json(fail('Không tìm thấy người dùng'));
    return;
  }

  res.json(ok(toPublicUser(user)));
});
