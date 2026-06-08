import { Router } from 'express';
import { store } from '../../data/store.js';
import { ok, fail } from '../../lib/http.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { courseSchema } from './course.schema.js';
import type { Course } from '../../data/courses.js';

export const coursesRouter = Router();

coursesRouter.get('/categories', (_req, res) => {
  const categories = Array.from(new Set(store.courses.map((course) => course.category)));
  res.json(ok(categories));
});

coursesRouter.get('/courses', (req, res) => {
  const search = String(req.query.search ?? '').trim().toLowerCase();
  const category = String(req.query.category ?? '').trim();
  const level = String(req.query.level ?? '').trim();

  const filteredCourses = store.courses.filter((course) => {
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search) ||
      course.description.toLowerCase().includes(search) ||
      course.instructor.toLowerCase().includes(search);
    const matchesCategory = !category || course.category === category;
    const matchesLevel = !level || course.level === level;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  res.json(ok(filteredCourses));
});

coursesRouter.post('/courses', requireAuth, requireRoles('admin', 'super_admin'), (req, res) => {
  const parsed = courseSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(fail('Dữ liệu khóa học không hợp lệ', parsed.error.issues));
    return;
  }

  const course: Course = {
    id: crypto.randomUUID(),
    ...parsed.data,
    image:
      parsed.data.image ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  };

  store.courses.unshift(course);
  res.status(201).json(ok(course, 'Đã tạo khóa học'));
});

coursesRouter.get('/courses/:id', (req, res) => {
  const course = store.courses.find((item) => item.id === req.params.id);

  if (!course) {
    res.status(404).json(fail('Không tìm thấy khóa học'));
    return;
  }

  res.json(ok(course));
});

coursesRouter.patch('/courses/:id', requireAuth, requireRoles('admin', 'super_admin'), (req, res) => {
  const courseIndex = store.courses.findIndex((item) => item.id === req.params.id);

  if (courseIndex < 0) {
    res.status(404).json(fail('Không tìm thấy khóa học'));
    return;
  }

  const parsed = courseSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(fail('Dữ liệu khóa học không hợp lệ', parsed.error.issues));
    return;
  }

  const updatedCourse = {
    ...store.courses[courseIndex],
    ...parsed.data,
  };

  store.courses[courseIndex] = updatedCourse;
  res.json(ok(updatedCourse, 'Đã cập nhật khóa học'));
});

coursesRouter.delete('/courses/:id', requireAuth, requireRoles('admin', 'super_admin'), (req, res) => {
  const courseIndex = store.courses.findIndex((item) => item.id === req.params.id);

  if (courseIndex < 0) {
    res.status(404).json(fail('Không tìm thấy khóa học'));
    return;
  }

  const [deletedCourse] = store.courses.splice(courseIndex, 1);
  res.json(ok(deletedCourse, 'Đã xóa khóa học'));
});
