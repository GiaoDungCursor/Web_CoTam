import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { AdminCourses } from './pages/AdminCourses';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Learning } from './pages/Learning';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="edupro-theme">
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="admin" element={<AdminCourses />} />

              <Route path="about" element={<div className="py-20 text-center"><h1 className="text-3xl font-bold">Về Chúng Tôi</h1></div>} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="learning/:id" element={<Learning />} />

              <Route path="*" element={<div className="py-20 text-center"><h1 className="text-3xl font-bold">404 - Không tìm thấy trang</h1></div>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
