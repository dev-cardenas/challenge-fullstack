import React, { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div style={{ flex: 1 }}>
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#919EAB', cursor: 'pointer', padding: 0 }}>
        ✕
      </button>
    </div>
  );
};
