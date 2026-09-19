import React, { useEffect } from 'react';
import styles from './dashboard.module.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClass = type === 'success' ? styles.toastSuccess : type === 'error' ? styles.toastError : styles.toastInfo;

  return (
    <div className={`${styles.toast} ${typeClass}`}>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
};

export default Toast;
