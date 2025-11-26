import React from 'react';
import { useAdmin, type Request } from '../../hooks/useAdmin';

export const AdminDashboard: React.FC = () => {
  const { requests, loading, handleLogout } = useAdmin();

  console.log({
    requests
  })

  if (loading) {
    return (
      <div className="center-content">
        <div style={{ color: 'var(--text-secondary)' }}>Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2>Solicitudes</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gestiona las solicitudes recibidas.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline">
          Cerrar Sesión
        </button>
      </div>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Monto</th>
                <th>Tipo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    No hay solicitudes registradas
                  </td>
                </tr>
              ) : (
                requests.map((request: Request) => (
                  <tr key={request.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>{request.id.substring(0, 8)}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{request.name}</div>
                    </td>
                    <td>{request.email}</td>
                    <td>${request.amount}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: 'rgba(0, 171, 85, 0.16)', 
                        color: 'var(--primary-dark)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {request.type}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
