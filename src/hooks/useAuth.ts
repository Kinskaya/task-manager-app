import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { LoginInput } from '../schema/authSchema.ts';
import { axiosInstance } from '../api/axiosInstance.ts';
import type { AxiosError } from 'axios';


export function useLogin() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const loginMutation = useMutation<unknown, AxiosError<{ message: string }>, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      const response = await axiosInstance.post('/auth/login', data);
      return response.data;
    },
    onSuccess: () => {
      setServerError(undefined);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/lists');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Произошла непредвиденная ошибка';
      setServerError(message);
    },
  });

  return {
    submitLogin: loginMutation.mutate,
    isPending: loginMutation.isPending,
    serverError,
  };
}