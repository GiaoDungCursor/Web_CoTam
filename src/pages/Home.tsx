import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiUsers, FiClock, FiPlayCircle } from 'react-icons/fi';
import { courses as fallbackCourses, type Course } from '../data/courses';
import { api } from '../services/api';

export const Home = () => {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => setCourses(fallbackCourses));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-background pt-16 pb-32">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-accent/20 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Khơi dậy tiềm năng của bạn với các khóa học <span className="text-gradient">Chất Lượng Cao</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Học hỏi từ các chuyên gia hàng đầu, cập nhật kiến thức mới nhất và thăng tiến trong sự nghiệp của bạn ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses" className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-xl shadow-primary/25 flex items-center gap-2">
              Bắt đầu học ngay <FiArrowRight />
            </Link>
            <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
              <FiPlayCircle className="w-5 h-5" /> Xem giới thiệu
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Khóa Học Nổi Bật</h2>
              <p className="text-muted-foreground">Những khóa học được đăng ký nhiều nhất trong tháng</p>
            </div>
            <Link to="/courses" className="text-primary font-medium flex items-center gap-2 hover:underline mt-4 md:mt-0">
              Xem tất cả <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="group flex flex-col bg-background rounded-2xl overflow-hidden border hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground">
                    {course.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><FiClock /> {course.duration}</span>
                    <span className="flex items-center gap-1"><FiUsers /> {course.students}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-medium"><FiStar className="fill-amber-500" /> {course.rating}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                        {course.instructor.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{course.instructor}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatPrice(course.price)}</div>
                      <div className="text-xs text-muted-foreground line-through">{formatPrice(course.originalPrice)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Bạn đã sẵn sàng nâng cấp kỹ năng?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hàng ngàn học viên đã và đang thăng tiến trong sự nghiệp nhờ các khóa học của EduPro. Tham gia cùng chúng tôi ngay hôm nay.
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg">
            Đăng ký tài khoản miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
};
