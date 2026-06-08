import { Link } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/use-cart';

export const Cart = () => {
  const { items, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary">
            <FiShoppingCart className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Bạn chưa thêm khóa học nào vào giỏ hàng. Hãy khám phá các khóa học phù hợp và bắt đầu học ngay hôm nay.
          </p>
          <Link
            to="/courses"
            className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Khám Phá Khóa Học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-foreground mb-8">Giỏ Hàng Của Bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
              <img
                src={item.image}
                alt={item.title}
                className="w-full sm:w-48 h-32 object-cover rounded-xl"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-2">{item.title}</h3>
                    <p className="font-bold text-primary whitespace-nowrap">
                      {item.price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Giảng viên: {item.instructor}</p>
                </div>
                <div className="flex justify-end mt-4 sm:mt-0">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm flex items-center gap-1 text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 h-fit sticky top-28">
          <h2 className="text-xl font-bold text-foreground mb-4">Tổng cộng</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính ({items.length} khóa học):</span>
              <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground pt-3 border-t">
              <span>Tổng thanh toán:</span>
              <span className="text-primary text-xl">{totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            Thanh Toán <FiArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Bằng việc thanh toán, bạn đồng ý với điều khoản dịch vụ của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};
