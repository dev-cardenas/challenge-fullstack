import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../useLogin';
import { api } from '@/api';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('@/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle successful login', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { token: 'fake-token' } });
    
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.onSubmit({ username: 'admin', password: 'password' });
    });

    expect(api.post).toHaveBeenCalledWith('/login', { username: 'admin', password: 'password' });
    expect(localStorage.getItem('jwt')).toBe('fake-token');
  });

  it('should handle login failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });
    
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      try {
        await result.current.onSubmit({ username: 'admin', password: 'wrong' });
      } catch (e) {
        // Expected error
      }
    });

    expect(api.post).toHaveBeenCalled();
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(result.current.error).toBe('Login failed');
  });
});
