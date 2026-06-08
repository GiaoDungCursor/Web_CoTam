import { Link } from 'react-router-dom';
import { FiBook, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-2 rounded-lg">
                <FiBook className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">Edu<span className="text-primary">Pro</span></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Nền tảng học trực tuyến cung cấp các khóa học chất lượng cao giúp bạn nâng cấp kỹ năng và thăng tiến trong sự nghiệp.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook"><FiFacebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter"><FiTwitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="YouTube"><FiYoutube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Khám Phá</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link to="/courses" className="hover:text-primary transition-colors">Tất cả khóa học</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Khóa học miễn phí</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Giảng viên</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog chia sẻ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ Trợ</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Trung tâm hỗ trợ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Đăng Ký Nhận Tin</h3>
            <p className="text-sm text-muted-foreground mb-4">Nhận thông tin về các khóa học mới và ưu đãi đặc biệt.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduPro. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
};
