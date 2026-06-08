import { z } from 'zod';

export const normalizeLevel = (value: unknown) => {
  const text = String(value ?? '').toLowerCase();

  if (text.includes('trung')) {
    return 'Trung bình';
  }

  if (text.includes('nang') || text.includes('nâng') || text.includes('cao')) {
    return 'Nâng cao';
  }

  return 'Cơ bản';
};

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  instructor: z.string().min(2),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  students: z.coerce.number().int().min(0).default(0),
  image: z.string().url().optional().or(z.literal('')),
  level: z.preprocess(normalizeLevel, z.enum(['Cơ bản', 'Trung bình', 'Nâng cao'])),
  duration: z.string().min(2),
  category: z.string().min(2),
});
