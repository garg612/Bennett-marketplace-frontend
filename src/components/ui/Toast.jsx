import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

const Toast = ({ id, message, type }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-md-primary" />,
    error: <AlertCircle className="h-5 w-5 text-md-tertiary" />,
    info: <Info className="h-5 w-5 text-md-primary" />,
  };

  const styles = {
    success: "border-md-outline/30 bg-md-surface-container",
    error: "border-md-tertiary/35 bg-md-tertiary/10",
    info: "border-md-outline/30 bg-md-secondary-container/70",
  };

  return (
    <div
      className={`mb-3 flex items-center gap-3 rounded-[24px] border p-4 shadow-md-md transition-all duration-300 ease-material animate-in slide-in-from-right-full ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-md-on-background">{message}</p>
      <button 
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="focus-ring rounded-full p-1 text-md-on-background/70 transition-colors duration-300 ease-material hover:bg-md-secondary-container hover:text-md-on-background"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-full max-w-sm pointer-events-none" aria-live="polite" aria-atomic="true">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
};