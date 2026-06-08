import { Link } from 'react-router-dom';
import { FiBook, FiShoppingCart, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import { ThemeToggle } from '../theme-toggle';
import { useCart } from '../../contexts/use-cart';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full glass theme-transition">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <FiBook className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-foreground">Edu<span className="text-primary">Pro</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Trang Chủ</Link>
          <Link to="/courses" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Khóa Học</Link>
          <Link to="/about" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Về Chúng Tôi</Link>
          <Link to="/admin" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link to="/cart" className="p-2.5 hover:bg-secondary text-foreground rounded-full transition-colors relative" title="Giỏ hàng">
            <FiShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/admin" className="p-2.5 hover:bg-secondary text-foreground rounded-full transition-colors" title="Admin">
            <FiSettings className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-border mx-1" />
          <Link to="/login" className="text-sm font-semibold text-foreground hover:text-primary px-2 transition-colors">Đăng Nhập</Link>
          <Link to="/register" className="text-sm font-semibold px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
            Đăng Ký
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Mở menu"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background/95 backdrop-blur-sm absolute w-full left-0 top-20 shadow-xl">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="font-medium px-2 py-1" onClick={closeMenu}>Trang Chủ</Link>
            <Link to="/courses" className="font-medium px-2 py-1" onClick={closeMenu}>Khóa Học</Link>
            <Link to="/cart" className="font-medium px-2 py-1" onClick={closeMenu}>Giỏ Hàng</Link>
            <Link to="/about" className="font-medium px-2 py-1 text-muted-foreground" onClick={closeMenu}>Về Chúng Tôi</Link>
            <Link to="/admin" className="font-medium px-2 py-1 text-muted-foreground" onClick={closeMenu}>Admin</Link>
            <hr className="border-border my-2" />
            <div className="flex flex-col gap-2">
              <Link to="/login" className="font-medium px-2 py-2 text-center border rounded-lg" onClick={closeMenu}>Đăng Nhập</Link>
              <Link to="/register" className="font-medium px-2 py-2 text-center bg-primary text-white rounded-lg" onClick={closeMenu}>Đăng Ký</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
