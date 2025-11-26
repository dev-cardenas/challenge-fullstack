import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'number' | 'password';
  placeholder?: string;
  error?: string | FieldError;
  register: UseFormRegisterReturn;
  className?: string;
  id?: string;
}

export const Input = ({
  label,
  type = 'text',
  placeholder,
  error,
  register,
  className = '',
  id,
}: InputProps) => {
  const inputId = id || register.name;
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={inputId} className="form-label">{label}</label>
      <input
        id={inputId}
        type={type}
        className={`form-input ${errorMessage ? 'error' : ''}`}
        placeholder={placeholder}
        {...register}
      />
      {errorMessage && <span className="error-text">{errorMessage}</span>}
    </div>
  );
};
