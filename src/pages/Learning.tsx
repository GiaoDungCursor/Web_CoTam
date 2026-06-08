import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlayCircle, FiCheckCircle, FiArrowLeft, FiMenu, FiX } from 'react-icons/fi';
import { courses } from '../data/courses';

const mockCurriculum = [
  {
    section: 'Chương 1: Giới thiệu',
    lessons: [
      { id: 1, title: 'Tổng quan về khóa học', duration: '05:20', completed: true },
      { id: 2, title: 'Cài đặt môi trường', duration: '12:45', completed: true },
      { id: 3, title: 'Chương trình đầu tiên', duration: '18:10', completed: false },
    ],
  },
  {
    section: 'Chương 2: Kiến thức cốt lõi',
    lessons: [
      { id: 4, title: 'Biến và kiểu dữ liệu', duration: '25:00', completed: false },
      { id: 5, title: 'Cấu trúc điều khiển', duration: '30:15', completed: false },
      { id: 6, title: 'Hàm và phạm vi', duration: '22:40', completed: false },
    ],
  },
  {
    section: 'Chương 3: Nâng cao',
    lessons: [
      { id: 7, title: 'Lập trình hướng đối tượng', duration: '45:00', completed: false },
      { id: 8, title: 'Xử lý bất đồng bộ', duration: '35:20', completed: false },
      { id: 9, title: 'Thực hành dự án thực tế', duration: '55:10', completed: false },
    ],
  },
];

export const Learning = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [activeLesson, setActiveLesson] = useState(mockCurriculum[0].lessons[2]);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-background">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="bg-black w-full aspect-video flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <FiPlayCircle className="w-20 h-20 text-white/80 hover:text-white hover:scale-110 cursor-pointer transition-all" />
          </div>
          <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-md">
            Trình phát video demo
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-4xl">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <Link to="/courses" className="flex items-center gap-1 hover:text-primary transition-colors">
              <FiArrowLeft /> Quay lại danh sách
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {activeLesson.title}
          </h1>
          <p className="text-muted-foreground">Thuộc khóa học: {course?.title}</p>

          <div className="mt-8 max-w-none text-foreground">
            <h3 className="text-xl font-bold mb-3">Nội dung bài học</h3>
            <p className="text-muted-foreground leading-relaxed">
              Đây là khu vực hiển thị mô tả chi tiết của bài học. Trong môi trường thực tế,
              nền tảng có thể tích hợp Video.js hoặc HLS.js kết hợp signed URL và watermark động
              để bảo vệ bản quyền nội dung.
            </p>
            <ul className="mt-4 list-disc pl-5 text-muted-foreground space-y-2">
              <li>Hỗ trợ phân giải 1080p, 720p, 480p</li>
              <li>Hạn chế tải video trái phép</li>
              <li>Tự động đánh dấu hoàn thành sau khi xem đủ thời lượng yêu cầu</li>
            </ul>
          </div>
        </div>
      </div>

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-border/50 flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${showSidebar ? 'translate-x-0 top-20' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-bold text-lg text-foreground">Nội dung khóa học</h2>
          <button className="lg:hidden p-2 text-muted-foreground" onClick={() => setShowSidebar(false)}>
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockCurriculum.map((section) => (
            <div key={section.section} className="border-b border-border/50">
              <div className="p-4 bg-muted/30 font-semibold text-sm text-foreground">
                {section.section}
              </div>
              <div>
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${activeLesson.id === lesson.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="mt-0.5">
                      {lesson.completed ? (
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <FiPlayCircle className={`w-5 h-5 ${activeLesson.id === lesson.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${activeLesson.id === lesson.id ? 'text-primary' : 'text-foreground'}`}>
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/30 lg:hidden z-30"
        onClick={() => setShowSidebar(true)}
        aria-label="Mở nội dung khóa học"
      >
        <FiMenu className="w-6 h-6" />
      </button>
    </div>
  );
};
