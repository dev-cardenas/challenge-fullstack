import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormRequest } from '../FormRequest';
import { useFormRequests } from '../../../hooks/useFormRequests';

// Mock the hook and api
jest.mock('../../../hooks/useFormRequests');
jest.mock('../../../../../api');

const mockUseFormRequests = useFormRequests as jest.MockedFunction<typeof useFormRequests>;

describe('FormRequest', () => {
  const mockRegister = jest.fn(() => ({
    name: 'test-field',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  }));
  const mockHandleSubmit = jest.fn((fn) => async (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    await fn();
  });
  const mockOnSubmit = jest.fn();
  const mockSetToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFormRequests.mockReturnValue({
      register: mockRegister as any,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isSubmitting: false,
      toast: null,
      onSubmit: mockOnSubmit,
      setToast: mockSetToast,
      reset: jest.fn(),
    });
  });

  it('renders form fields', () => {
    render(<FormRequest />);
    
    expect(screen.getByText('Nueva Solicitud')).toBeInTheDocument();
    expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByText('Monto')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Solicitud')).toBeInTheDocument();
  });

  it('displays validation errors', () => {
    mockUseFormRequests.mockReturnValue({
      register: mockRegister as any,
      handleSubmit: mockHandleSubmit,
      errors: {
        name: { type: 'required', message: 'El nombre es requerido' },
        email: { type: 'required', message: 'El email es requerido' },
      },
      isSubmitting: false,
      toast: null,
      onSubmit: mockOnSubmit,
      setToast: mockSetToast,
      reset: jest.fn(),
    });

    render(<FormRequest />);
    
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('El email es requerido')).toBeInTheDocument();
  });

  it('submits the form', async () => {
    render(<FormRequest />);
    
    const submitButton = screen.getByRole('button', { name: /enviar solicitud/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('displays toast when toast state is present', () => {
    mockUseFormRequests.mockReturnValue({
      register: mockRegister as any,
      handleSubmit: mockHandleSubmit,
      errors: {},
      isSubmitting: false,
      toast: {
        type: 'success',
        title: 'Success',
        message: 'Operation successful',
      },
      onSubmit: mockOnSubmit,
      setToast: mockSetToast,
      reset: jest.fn(),
    });

    render(<FormRequest />);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });
});
