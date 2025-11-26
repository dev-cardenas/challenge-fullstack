import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../../api';

interface FormData {
  name: string;
  email: string;
  amount: number;
  type: string;
  comments: string;
}


export const useFormRequests = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      amount: 0,
      type: 'Reembolso',
      comments: ''
    }
  });

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/solicitudes', data);

      setToast({
        type: 'success',
        title: 'Solicitud Enviada',
        message: 'Tu solicitud ha sido registrada correctamente.'
      });

      reset();
    } catch (error) {
      console.error(error);
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Hubo un problema al enviar la solicitud. Inténtalo de nuevo.'
      });
    }
  };

  return {
    register,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    toast,
    onSubmit,
    setToast
  }
}
