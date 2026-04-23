import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ 
  title = 'Something went wrong', 
  message, 
  action,
  className = ''
}) => {
  return (
    <div className={`rounded-[24px] border border-md-tertiary/35 bg-md-tertiary/10 p-5 shadow-md-sm ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-md-tertiary" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-label font-medium text-md-on-background">
            {title}
          </h3>
          {message && (
            <div className="mt-1 text-sm text-md-on-background/80">
              <p>{message}</p>
            </div>
          )}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};