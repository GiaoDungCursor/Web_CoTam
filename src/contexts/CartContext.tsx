import { useState, useEffect } from 'react';
import type { Course } from '../data/courses';
import { CartContext, type CartItem } from './cart-context';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('edupro_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('edupro_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === course.id);
      if (existing) {
        // Since these are courses, maybe they can only buy once. But for now, let's keep logic simple.
        // Actually, for courses, you usually only buy a course once.
        return current;
      }
      return [...current, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems((current) => current.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length; // Only counting distinct courses
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
