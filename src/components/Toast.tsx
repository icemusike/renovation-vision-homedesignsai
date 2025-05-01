import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center p-4 mb-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
      )}
      <p className={`text-sm ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
        {message}
      </p>
      <button 
        onClick={onClose}
        className="ml-auto p-1 rounded-full hover:bg-gray-200 transition-colors"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </motion.div>
  );
};

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add to global window object for access from anywhere
  useEffect(() => {
    const toast = {
      success: (message: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type: 'success' }]);
        return id;
      },
      error: (message: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type: 'error' }]);
        return id;
      },
      dismiss: (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }
    };

    // @ts-ignore
    window.toast = toast;

    return () => {
      // @ts-ignore
      delete window.toast;
    };
  }, []);

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => handleClose(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Create a global toast function
declare global {
  interface Window {
    toast: {
      success: (message: string) => string;
      error: (message: string) => string;
      dismiss: (id: string) => void;
    };
  }
}

export const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined' && window.toast) {
      return window.toast.success(message);
    }
    return '';
  },
  error: (message: string) => {
    if (typeof window !== 'undefined' && window.toast) {
      return window.toast.error(message);
    }
    return '';
  },
  dismiss: (id: string) => {
    if (typeof window !== 'undefined' && window.toast) {
      window.toast.dismiss(id);
    }
  }
};
