import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../../api';

export interface LoginFormData {
  username: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const response = await api.post('/login', data);
      const { token } = response.data;
      localStorage.setItem('jwt', token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    onSubmit,
  };
};
