export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice: number;
  rating: number;
  students: number;
  image: string;
  level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  duration: string;
  category: string;
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'React JS Thực Chiến: Từ Cơ Bản Đến Chuyên Sâu',
    description: 'Khóa học React JS toàn diện, bao gồm Hooks, Context, Redux và Next.js. Học qua các dự án thực tế.',
    instructor: 'Nguyễn Văn A',
    price: 599000,
    originalPrice: 1200000,
    rating: 4.8,
    students: 1250,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Cơ bản',
    duration: '40 giờ',
    category: 'Lập trình Web',
  },
  {
    id: 'c2',
    title: 'Thiết Kế UI/UX Chuyên Nghiệp Với Figma',
    description: 'Làm chủ Figma từ A-Z và quy trình thiết kế UI/UX chuẩn mực để tạo ra sản phẩm đẹp, dễ dùng.',
    instructor: 'Trần Thị B',
    price: 499000,
    originalPrice: 900000,
    rating: 4.9,
    students: 3420,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Cơ bản',
    duration: '25 giờ',
    category: 'Thiết kế',
  },
  {
    id: 'c3',
    title: 'Lập Trình Backend Node.js, Express và MongoDB',
    description: 'Xây dựng backend RESTful API, bảo mật JWT và quản lý database với MongoDB.',
    instructor: 'Lê Văn C',
    price: 699000,
    originalPrice: 1500000,
    rating: 4.7,
    students: 890,
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Trung bình',
    duration: '55 giờ',
    category: 'Lập trình Web',
  },
  {
    id: 'c4',
    title: 'Master TypeScript Trong 10 Ngày',
    description: 'Nắm vững TypeScript để viết JavaScript an toàn và dễ bảo trì hơn trong React và Node.js.',
    instructor: 'Phạm D',
    price: 399000,
    originalPrice: 800000,
    rating: 4.6,
    students: 540,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Trung bình',
    duration: '15 giờ',
    category: 'Lập trình Web',
  },
  {
    id: 'c5',
    title: 'Data Science & Machine Learning Với Python',
    description: 'Khám phá khoa học dữ liệu và xây dựng mô hình AI dự đoán với Pandas, Scikit-learn và TensorFlow.',
    instructor: 'Hoàng E',
    price: 899000,
    originalPrice: 2000000,
    rating: 4.9,
    students: 2100,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Nâng cao',
    duration: '80 giờ',
    category: 'Data Science',
  },
  {
    id: 'c6',
    title: 'Tiếng Anh Giao Tiếp IT',
    description: 'Tự tin giao tiếp tiếng Anh trong môi trường IT, luyện phỏng vấn và viết CV chuẩn quốc tế.',
    instructor: 'Anna Nguyễn',
    price: 450000,
    originalPrice: 950000,
    rating: 4.8,
    students: 4500,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Cơ bản',
    duration: '30 giờ',
    category: 'Ngoại ngữ',
  },
];
