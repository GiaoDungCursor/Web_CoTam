export type Role = 'student' | 'instructor' | 'admin' | 'super_admin';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface User extends PublicUser {
  passwordHash: string;
}

export interface Order {
  id: string;
  userId: string;
  courseIds: string[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
