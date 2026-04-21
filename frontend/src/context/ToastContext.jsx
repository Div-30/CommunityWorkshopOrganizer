import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'info' }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, title, message, type }]);

      window.setTimeout(() => {
        removeToast(id);
      }, 4500);

      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      success: (message, title = "You're all set!") =>
        addToast({ title, message, type: 'success' }),
      error: (message, title = "Hmm, that didn't work") =>
        addToast({ title, message, type: 'error' }),
      info: (message, title = 'A quick heads-up') =>
        addToast({ title, message, type: 'info' }),
      warning: (message, title = 'Worth a quick look') =>
        addToast({ title, message, type: 'warning' }),
    }),
    [toasts, addToast, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}
