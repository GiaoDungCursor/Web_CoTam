import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../data/store.js';
import { ok, fail } from '../../lib/http.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import type { Order } from '../../types.js';

export const ordersRouter = Router();

const orderSchema = z.object({
  userId: z.string().min(1),
  courseIds: z.array(z.string()).min(1),
});

ordersRouter.post('/orders', requireAuth, (req, res) => {
  const parsed = orderSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(fail('Dữ liệu đơn hàng không hợp lệ', parsed.error.issues));
    return;
  }

  if (req.authUser?.role === 'student' && parsed.data.userId !== req.authUser.id) {
    res.status(403).json(fail('Bạn chỉ có thể tạo đơn hàng cho chính mình'));
    return;
  }

  const selectedCourses = store.courses.filter((course) => parsed.data.courseIds.includes(course.id));

  if (selectedCourses.length !== parsed.data.courseIds.length) {
    res.status(400).json(fail('Một hoặc nhiều khóa học không tồn tại'));
    return;
  }

  const order: Order = {
    id: crypto.randomUUID(),
    userId: parsed.data.userId,
    courseIds: parsed.data.courseIds,
    totalAmount: selectedCourses.reduce((total, course) => total + course.price, 0),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  store.orders.push(order);

  res.status(201).json(ok(order, 'Đã tạo đơn hàng'));
});

ordersRouter.get('/orders', requireAuth, requireRoles('admin', 'super_admin'), (_req, res) => {
  res.json(ok(store.orders));
});
