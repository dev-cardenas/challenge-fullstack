import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';

export interface Request {
  id: string;
  name: string;
  email: string;
  amount: number;
  type: string;
  comments: string;
  createdAt: string;
}

export const useAdmin = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/solicitudes');
        setRequests(response.data);
      } catch (err) {
        console.error(err);
        // If error is 403, redirect to login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return {
    requests,
    loading,
    handleLogout,
  };
};
