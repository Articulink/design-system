'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Articulink Toast Component
 *
 * Toast notification system with context-based state management.
 *
 * Usage:
 *   // Wrap your app with ToastProvider
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 *   // In components, use the hook
 *   const { addToast } = useToast();
 *   addToast('success', 'Operation completed!');
 *
 *   // Or use convenience hooks
 *   const showSuccess = useSuccessToast();
 *   showSuccess('Saved!');
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  warning: 'bg-warning text-abyss',
  info: 'bg-tide text-white',
};

const toastIcons: Record<ToastType, ReactNode> = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${toastStyles[toast.type]} animate-slide-in`}
      role="alert"
    >
      <span className="flex-shrink-0">{toastIcons[toast.type]}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container - positioned bottom-right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Convenience hooks for common toast types
export function useSuccessToast() {
  const { addToast } = useToast();
  return useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast]);
}

export function useErrorToast() {
  const { addToast } = useToast();
  return useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast]);
}

export function useWarningToast() {
  const { addToast } = useToast();
  return useCallback((message: string, duration?: number) => addToast('warning', message, duration), [addToast]);
}

export function useInfoToast() {
  const { addToast } = useToast();
  return useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast]);
}

export default ToastProvider;
