import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/use-cart';
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      alert('Thanh toán thành công! Bạn có thể bắt đầu học ngay.');
      navigate('/courses');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-foreground mb-8">Thanh Toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Họ và tên</label>
                  <input type="text" required defaultValue="Học viên EduPro" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <input type="email" required defaultValue="hocvien@example.com" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                  <input type="radio" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 text-primary accent-primary" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Thanh toán qua VNPay</span>
                    <span className="text-xs font-bold rounded-full bg-secondary px-2 py-1 text-secondary-foreground">VNPay</span>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                  <input type="radio" name="payment" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-4 h-4 text-primary accent-primary" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Thanh toán qua Ví MoMo</span>
                    <span className="text-xs font-bold rounded-full bg-secondary px-2 py-1 text-secondary-foreground">MoMo</span>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-primary accent-primary" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Thẻ Tín dụng / Ghi nợ</span>
                    <FiCreditCard className="w-6 h-6 text-muted-foreground" />
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 sticky top-28">
            <h2 className="text-xl font-bold text-foreground mb-4">Đơn hàng của bạn</h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-md" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</h4>
                    <p className="text-sm font-bold text-primary mt-1">{item.price.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t">
              <div className="flex justify-between font-bold text-lg text-foreground">
                <span>Tổng thanh toán:</span>
                <span className="text-primary text-2xl">{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-5 h-5" /> Xác nhận thanh toán
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
