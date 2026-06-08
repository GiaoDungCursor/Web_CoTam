import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FiEdit2, FiPlus, FiRefreshCw, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { api } from '../services/api';
import { courses as fallbackCourses, type Course } from '../data/courses';

type CourseForm = Omit<Course, 'id'>;

const emptyForm: CourseForm = {
  title: '',
  description: '',
  instructor: '',
  price: 0,
  originalPrice: 0,
  rating: 4.5,
  students: 0,
  image: '',
  level: 'Cơ bản',
  duration: '',
  category: '',
};

export const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthed, setIsAuthed] = useState(Boolean(api.getAccessToken()));
  const [loginEmail, setLoginEmail] = useState('admin@edupro.local');
  const [loginPassword, setLoginPassword] = useState('Admin@123');

  const totalRevenue = useMemo(
    () => courses.reduce((total, course) => total + course.price * course.students, 0),
    [courses],
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const loadCourses = () => {
    api
      .getCourses()
      .then(setCourses)
      .catch(() => {
        setCourses(fallbackCourses);
        setMessage('Backend chưa chạy, đang hiển thị dữ liệu mẫu.');
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    try {
      const session = await api.login(loginEmail, loginPassword);
      api.setAccessToken(session.accessToken);
      setIsAuthed(true);
      setMessage(`Đã đăng nhập admin: ${session.user.email}`);
    } catch {
      setMessage('Không thể đăng nhập admin. Hãy kiểm tra backend hoặc tài khoản demo.');
    }
  };

  const handleLogout = () => {
    api.clearAccessToken();
    setIsAuthed(false);
    setMessage('Đã đăng xuất admin.');
  };

  const updateField = <K extends keyof CourseForm>(field: K, value: CourseForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      if (editingId) {
        const updatedCourse = await api.updateCourse(editingId, form);
        setCourses((current) => current.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)));
        setMessage('Đã cập nhật khóa học.');
      } else {
        const createdCourse = await api.createCourse(form);
        setCourses((current) => [createdCourse, ...current]);
        setMessage('Đã tạo khóa học mới.');
      }

      resetForm();
    } catch {
      setMessage('Không thể lưu khóa học. Hãy kiểm tra backend hoặc dữ liệu nhập.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      originalPrice: course.originalPrice,
      rating: course.rating,
      students: course.students,
      image: course.image,
      level: course.level,
      duration: course.duration,
      category: course.category,
    });
    setMessage('');
  };

  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm(`Xóa khóa học "${course.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteCourse(course.id);
      setCourses((current) => current.filter((item) => item.id !== course.id));
      setMessage('Đã xóa khóa học.');
      if (editingId === course.id) {
        resetForm();
      }
    } catch {
      setMessage('Không thể xóa khóa học. Hãy kiểm tra backend.');
    }
  };

  return (
    <div className="bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Quản lý khóa học</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Tạo, chỉnh sửa và xóa khóa học. Dữ liệu hiện lưu trong backend memory để phục vụ MVP.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadCourses}
              className="inline-flex items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              <FiRefreshCw /> Tải lại
            </button>
            {isAuthed && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
              >
                Đăng xuất admin
              </button>
            )}
          </div>
        </div>

        {!isAuthed && (
          <form onSubmit={handleLogin} className="mb-8 rounded-lg border bg-card p-5">
            <h2 className="text-xl font-bold">Đăng nhập admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tài khoản demo: admin@edupro.local / Admin@123
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className="rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="rounded-lg bg-primary px-5 py-2 font-bold text-white hover:bg-primary/90">
                Đăng nhập
              </button>
            </div>
          </form>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground">Tổng khóa học</p>
            <p className="mt-2 text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground">Học viên mock</p>
            <p className="mt-2 text-3xl font-bold">{courses.reduce((total, course) => total + course.students, 0).toLocaleString('vi-VN')}</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground">Doanh thu ước tính</p>
            <p className="mt-2 text-2xl font-bold">{formatPrice(totalRevenue)}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Sửa khóa học' : 'Tạo khóa học'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                  <FiX /> Hủy sửa
                </button>
              )}
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Tên khóa học</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Mô tả</span>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Giảng viên</span>
                  <input
                    required
                    value={form.instructor}
                    onChange={(event) => updateField('instructor', event.target.value)}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Danh mục</span>
                  <input
                    required
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Giá bán</span>
                  <input
                    required
                    min={0}
                    type="number"
                    value={form.price}
                    onChange={(event) => updateField('price', Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Giá gốc</span>
                  <input
                    required
                    min={0}
                    type="number"
                    value={form.originalPrice}
                    onChange={(event) => updateField('originalPrice', Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-medium">Trình độ</span>
                  <select
                    value={form.level}
                    onChange={(event) => updateField('level', event.target.value as CourseForm['level'])}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Cơ bản</option>
                    <option>Trung bình</option>
                    <option>Nâng cao</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Thời lượng</span>
                  <input
                    required
                    value={form.duration}
                    placeholder="20 giờ"
                    onChange={(event) => updateField('duration', event.target.value)}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Rating</span>
                  <input
                    min={0}
                    max={5}
                    step={0.1}
                    type="number"
                    value={form.rating}
                    onChange={(event) => updateField('rating', Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Ảnh khóa học URL</span>
                <input
                  value={form.image}
                  placeholder="https://..."
                  onChange={(event) => updateField('image', event.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <button
                disabled={isSaving}
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60"
              >
                {editingId ? <FiSave /> : <FiPlus />}
                {isSaving ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Tạo khóa học'}
              </button>

              {message && <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">{message}</p>}
            </div>
          </form>

          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="border-b p-5">
              <h2 className="text-xl font-bold">Danh sách khóa học</h2>
            </div>
            <div className="divide-y">
              {courses.map((course) => (
                <div key={course.id} className="grid gap-4 p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
                  <img src={course.image} alt={course.title} className="h-24 w-24 rounded-lg object-cover" />
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{course.category}</span>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold">{course.level}</span>
                    </div>
                    <h3 className="font-bold">{course.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{course.instructor}</span>
                      <span>{course.duration}</span>
                      <span>{course.students.toLocaleString('vi-VN')} học viên</span>
                      <span className="font-semibold text-foreground">{formatPrice(course.price)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-secondary"
                    >
                      <FiEdit2 /> Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(course)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 /> Xóa
                    </button>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">
                  Chưa có khóa học nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
