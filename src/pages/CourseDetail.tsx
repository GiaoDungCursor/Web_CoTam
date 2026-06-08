import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiCheck, FiPlayCircle, FiShield, FiMonitor } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { courses as fallbackCourses, type Course } from '../data/courses';
import { api } from '../services/api';
import { useCart } from '../contexts/use-cart';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [course, setCourse] = useState<Course | undefined>(() => fallbackCourses.find(c => c.id === id));

  useEffect(() => {
    if (!id) {
      return;
    }

    api
      .getCourse(id)
      .then(setCourse)
      .catch(() => setCourse(fallbackCourses.find(c => c.id === id)));
  }, [id]);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
        <Link to="/courses" className="text-primary hover:underline">Quay lại danh sách khóa học</Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const benefits = [
    'Truy cập trọn đời vào nội dung khóa học',
    'Chứng chỉ hoàn thành sau khi kết thúc',
    'Hỗ trợ giải đáp thắc mắc từ giảng viên',
    'Cập nhật nội dung mới miễn phí',
    'Bài tập thực hành có tính ứng dụng cao',
    'Thảo luận cùng cộng đồng học viên',
  ];

  const curriculum = [
    { title: 'Phần 1: Giới thiệu tổng quan', lectures: 3, duration: '45 phút' },
    { title: 'Phần 2: Kiến thức nền tảng', lectures: 8, duration: '2.5 giờ' },
    { title: 'Phần 3: Đi sâu vào các khái niệm cốt lõi', lectures: 12, duration: '4 giờ' },
    { title: 'Phần 4: Thực hành dự án thực tế', lectures: 15, duration: '6 giờ' },
    { title: 'Phần 5: Tổng kết và chứng chỉ', lectures: 2, duration: '30 phút' },
  ];

  return (
    <div className="bg-background">
      <div className="bg-foreground text-background py-16 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <span>{course.category}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
              {course.title}
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                  {course.instructor.charAt(0)}
                </div>
                <span className="font-medium text-white">Giảng viên: {course.instructor}</span>
              </div>
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <FiStar className="fill-amber-500" /> {course.rating} ({(course.students / 3).toFixed(0)} đánh giá)
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <FiUsers /> {course.students} học viên
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <FiClock /> {course.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-card border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Bạn sẽ học được gì?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 text-primary">
                      <FiCheck className="w-5 h-5" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
              <div className="border rounded-2xl overflow-hidden bg-card">
                <div className="bg-secondary/50 p-4 border-b flex justify-between text-sm font-medium">
                  <span>{curriculum.length} phần • {curriculum.reduce((acc, curr) => acc + curr.lectures, 0)} bài giảng</span>
                  <span>Tổng thời lượng: {course.duration}</span>
                </div>
                <div className="divide-y">
                  {curriculum.map((section) => (
                    <div key={section.title} className="p-4 md:p-6 hover:bg-secondary/20 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {section.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {section.lectures} bài • {section.duration}
                        </span>
                      </div>
                      <div className="mt-4 space-y-3 pl-2 border-l-2 border-primary/20">
                        {Array.from({ length: 2 }).map((_, idx) => (
                          <div key={`${section.title}-${idx}`} className="flex items-center justify-between text-sm text-muted-foreground ml-4">
                            <span className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
                              <FiPlayCircle className="w-4 h-4" /> Bài giảng {idx + 1}
                            </span>
                            <span className="text-xs">10:00</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border rounded-2xl p-6 shadow-2xl lg:-mt-64 relative z-20">
              <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group cursor-pointer">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FiPlayCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 w-full text-center text-white text-sm font-medium">
                  Xem trước khóa học
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold text-foreground">{formatPrice(course.price)}</span>
                  <span className="text-lg text-muted-foreground line-through pb-1">{formatPrice(course.originalPrice)}</span>
                </div>
                <div className="text-sm text-red-500 font-medium">
                  Tiết kiệm {Math.round((1 - course.price / course.originalPrice) * 100)}%
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => { addToCart(course); navigate('/checkout'); }}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Đăng Ký Ngay
                </button>
                <button 
                  onClick={() => { addToCart(course); alert('Đã thêm vào giỏ hàng'); }}
                  className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors"
                >
                  Thêm Vào Giỏ Hàng
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground mb-6">
                Cam kết hoàn tiền trong 30 ngày
              </p>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Khóa học này bao gồm:</h4>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li className="flex items-center gap-3"><FiMonitor className="w-4 h-4" /> Truy cập trên mọi thiết bị</li>
                  <li className="flex items-center gap-3"><FiCheck className="w-4 h-4" /> Giấy chứng nhận hoàn thành</li>
                  <li className="flex items-center gap-3"><FiShield className="w-4 h-4" /> Thanh toán an toàn 100%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
