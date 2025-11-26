import { renderHook, act } from '@testing-library/react';
import { useFormRequests } from '../useFormRequests';
import { api } from '../../../../api';

// Mock api
jest.mock('../../../../api');

describe('useFormRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useFormRequests());
    
    expect(result.current.toast).toBeNull();
  });

  it('handles successful submission', async () => {
    jest.spyOn(api, 'post').mockResolvedValue({} as any);
    const { result } = renderHook(() => useFormRequests());

    const formData = {
      name: 'Test',
      email: 'test@example.com',
      amount: 100,
      type: 'Reembolso',
      comments: ''
    };

    await act(async () => {
      await result.current.onSubmit(formData);
    });

    expect(api.post).toHaveBeenCalledWith('/solicitudes', formData);
    expect(result.current.toast).toEqual({
      type: 'success',
      title: 'Solicitud Enviada',
      message: 'Tu solicitud ha sido registrada correctamente.'
    });
  });

  it('handles submission error', async () => {
    jest.spyOn(api, 'post').mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useFormRequests());

    const formData = {
      name: 'Test',
      email: 'test@example.com',
      amount: 100,
      type: 'Reembolso',
      comments: ''
    };

    await act(async () => {
      await result.current.onSubmit(formData);
    });

    expect(result.current.toast).toEqual({
      type: 'error',
      title: 'Error',
      message: 'Hubo un problema al enviar la solicitud. Inténtalo de nuevo.'
    });
  });
});
