import { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}, ref) => {
  // Generate a random fallback ID if none is provided so the label always links correctly to the input
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-label font-medium text-md-on-background">
          {label}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        className={`
          input-material w-full
          disabled:cursor-not-allowed disabled:opacity-50
          focus-ring
          ${error
            ? 'border-b-md-tertiary'
            : 'border-b-md-outline'
          }
          ${className}
        `}
        {...props}
      />

      {/* Error message takes priority over helper text */}
      {error && (
        <p className="text-sm text-md-tertiary">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-md-on-background/70">{helperText}</p>
      )}
    </div>
  );
});

// Required when using forwardRef so React DevTools shows the component name properly
Input.displayName = 'Input';