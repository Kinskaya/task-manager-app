import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен для заполнения')
    .pipe(z.email({ message: 'Некорректный формат email' })),

  password: z
    .string()
    .min(1, 'Пароль обязателен для заполнения')
    .min(6, 'Пароль должен быть не менее 6 символов'),
})

export type LoginInput = z.infer<typeof loginSchema>;