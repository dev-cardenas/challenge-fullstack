import { render, screen, fireEvent } from '@testing-library/react';
import { AdminDashboard } from '../AdminDashboard';
import { useAdmin } from '../../../hooks/useAdmin';

// Mock the hook and api
jest.mock('../../../hooks/useAdmin');
jest.mock('../../../../../api');

const mockUseAdmin = useAdmin as jest.MockedFunction<typeof useAdmin>;

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    mockUseAdmin.mockReturnValue({
      requests: [],
      loading: true,
      handleLogout: jest.fn(),
    });

    render(<AdminDashboard />);
    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();
  });

  it('shows empty state when no requests', () => {
    mockUseAdmin.mockReturnValue({
      requests: [],
      loading: false,
      handleLogout: jest.fn(),
    });

    render(<AdminDashboard />);
    expect(screen.getByText('No hay solicitudes registradas')).toBeInTheDocument();
  });

  it('renders table with requests', () => {
    const mockRequests = [
      {
        id: '123456789',
        name: 'Test User',
        email: 'test@example.com',
        amount: 100,
        type: 'CLOTHING',
        comments: 'Test comment',
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    mockUseAdmin.mockReturnValue({
      requests: mockRequests,
      loading: false,
      handleLogout: jest.fn(),
    });

    render(<AdminDashboard />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('CLOTHING')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument(); // First 8 chars of ID
  });

  it('calls handleLogout when logout button is clicked', () => {
    const mockHandleLogout = jest.fn();
    mockUseAdmin.mockReturnValue({
      requests: [],
      loading: false,
      handleLogout: mockHandleLogout,
    });

    render(<AdminDashboard />);
    
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
