import bcrypt from 'bcryptjs';
import { courses } from './courses.js';
import type { Order, User } from '../types.js';

export const users: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Admin EduPro',
    email: 'admin@edupro.local',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export const orders: Order[] = [];

export const store = {
  courses,
  users,
  orders,
};
