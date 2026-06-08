import { createContext } from 'react';
import type { Course } from '../data/courses';

export interface CartItem extends Course {
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
