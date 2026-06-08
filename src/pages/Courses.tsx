import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiFilter, FiSearch } from 'react-icons/fi';
import { courses as fallbackCourses, type Course } from '../data/courses';
import { api } from '../services/api';

export const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => setCourses(fallbackCourses));
  }, []);

  const categories = ['Tất cả', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Khám phá Khóa Học</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Lựa chọn từ hàng trăm khóa học chất lượng được giảng dạy bởi các chuyên gia. Nâng cao kỹ năng của bạn ngay hôm nay.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <span className="flex items-center gap-2 text-muted-foreground font-medium mr-2 whitespace-nowrap">
                <FiFilter /> Lọc theo:
              </span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="group flex flex-col bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-foreground">
                    {course.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                    <FiClock /> {course.duration}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-sm">
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
                      <FiStar className="fill-amber-500" /> {course.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FiUsers /> {course.students} học viên
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">{formatPrice(course.price)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border">
            <h3 className="text-xl font-bold mb-2">Không tìm thấy khóa học nào</h3>
            <p className="text-muted-foreground">Vui lòng thử nghiệm với từ khóa hoặc danh mục khác.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Tất cả'); }}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
