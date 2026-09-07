import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Floating Stack */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
              info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
            };

            const borders = {
              success: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-950 dark:text-emerald-100',
              error: 'border-rose-200 dark:border-rose-800/60 bg-rose-50/95 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100',
              warning: 'border-amber-200 dark:border-amber-800/60 bg-amber-50/95 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100',
              info: 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/95 dark:bg-indigo-950/90 text-indigo-950 dark:text-indigo-100',
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-premium backdrop-blur-md ${borders[toast.type] || borders.info}`}
              >
                {icons[toast.type] || icons.info}
                <div className="flex-1 text-sm font-medium leading-snug">
                  {toast.message}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors -mr-1 -mt-1 p-1 rounded-lg"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
