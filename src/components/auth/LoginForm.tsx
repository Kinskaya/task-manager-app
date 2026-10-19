import { type LoginInput, loginSchema } from '../../schema/authSchema.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type TProps = {
  onSubmit: (data: LoginInput) => void;
  error?: string | null;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, error = null, isLoading = false }: TProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  return (
    <div
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Вход в систему
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Введите свои данные для доступа к спискам задач
        </p>
      </div>

      {error && (
        <div
          className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            id="email"
            {...register('email')}
            type="email"
            placeholder="name@example.com"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-lg border bg-transparent text-slate-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
              errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Пароль
          </label>
          <input
            id="password"
            {...register('password')}
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-lg border bg-transparent text-slate-950 dark:text-white outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
              errors.password
                ? 'border-red-500 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Проверка...
            </span>
          ) : (
            'Войти'
          )}
        </button>
      </form>
    </div>
  );
}