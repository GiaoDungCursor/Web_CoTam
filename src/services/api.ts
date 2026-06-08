import type { Course } from '../data/courses';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
const AUTH_TOKEN_KEY = 'edupro_access_token';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin' | 'super_admin';
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const accessToken = localStorage.getItem(AUTH_TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.success) {
    throw new Error(payload.message);
  }

  return payload.data;
};

export const api = {
  setAccessToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearAccessToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
  getAccessToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  login: (email: string, password: string) =>
    request<AuthSession>('/auth/login', { method: 'POST', body: { email, password } }),
  getMe: () => request<AuthUser>('/auth/me'),
  getCourses: () => request<Course[]>('/courses'),
  getCourse: (id: string) => request<Course>(`/courses/${id}`),
  createCourse: (course: Omit<Course, 'id'>) => request<Course>('/courses', { method: 'POST', body: course }),
  updateCourse: (id: string, course: Partial<Omit<Course, 'id'>>) =>
    request<Course>(`/courses/${id}`, { method: 'PATCH', body: course }),
  deleteCourse: (id: string) => request<Course>(`/courses/${id}`, { method: 'DELETE' }),
};
