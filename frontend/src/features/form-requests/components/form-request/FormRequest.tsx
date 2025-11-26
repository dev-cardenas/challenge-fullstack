import React from 'react';
import { Toast } from '../../../../components/Toast';
import { useFormRequests } from '../../hooks/useFormRequests';
import { RequestTypes } from './constants';
import { Input } from '../../../../components/Input';

export const FormRequest: React.FC = () => {
  const {  
    register,
    handleSubmit,
    errors,
    isSubmitting,
    toast,
    onSubmit,
    setToast
  } = useFormRequests();

  return (
    <div className="center-content">
      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2>Nueva Solicitud</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Completa el formulario para registrar tu solicitud.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre */}
          <Input
            label="Nombre Completo"
            type="text"
            placeholder="Ej: Juan Pérez"
            error={errors.name?.message}
            register={register('name', { required: 'El nombre es requerido' })}
          />

          {/* Email */}
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="juan@empresa.com"
            error={errors.email?.message}
            register={register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email inválido'
              }
            })}
          />

          {/* Monto + Tipo */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            {/* Monto */}
            <Input
              label="Monto"
              type="number"
              placeholder="0.00"
              error={errors.amount?.message}
              register={register('amount', {
                required: 'El monto es requerido',
                min: {
                  value: 1,
                  message: 'El monto debe ser mayor a 0'
                }
              })}
            />

            {/* Tipo */}
            <div className="form-group">
              <label className="form-label">Tipo de Solicitud</label>
              <select className="form-select" {...register('type')}>
                {RequestTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comentarios */}
          <div className="form-group">
            <label className="form-label">Comentarios (Opcional)</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Detalles adicionales..."
              {...register('comments')}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>

      {toast && (
        <div className="toast-container">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};
