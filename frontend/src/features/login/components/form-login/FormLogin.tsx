import React from 'react';
import { Input } from '../../../../components/Input';
import { useLogin } from '../../hooks/useLogin';

export const FormLogin: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    onSubmit,
  } = useLogin();

  return (
    <div className="center-content">
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2>Bienvenido</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ingresa tus credenciales de administrador</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Usuario"
            type="text"
            placeholder="admin"
            error={errors.username?.message}
            register={register('username', { 
              required: 'El usuario es requerido' 
            })}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="admin123"
            error={errors.password?.message}
            register={register('password', { 
              required: 'La contraseña es requerida',
              minLength: {
                value: 3,
                message: 'La contraseña debe tener al menos 3 caracteres'
              }
            })}
          />

          {error && <p className="error-text" style={{ marginBottom: '16px' }}>{error}</p>}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};
