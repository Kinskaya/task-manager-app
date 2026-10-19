import { useLogin } from '../hooks/useAuth.ts';
import type { LoginInput } from '../schema/authSchema.ts';
import { LoginForm } from '../components/auth/LoginForm.tsx';

export const LoginPage = () => {

  const { submitLogin, isPending, serverError } = useLogin()

  const handleSubmit = (data: LoginInput) => {
    submitLogin(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          error={serverError}
        />
      </div>
    </div>
  );
};