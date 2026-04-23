import { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  error,
  helperText,
  id,
  options = [],
  className = '',
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-label font-medium text-md-on-background">
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        ref={ref}
        className={`
          input-material w-full appearance-none pr-8
          disabled:cursor-not-allowed disabled:opacity-50
          focus-ring
          ${error
            ? 'border-b-md-tertiary'
            : 'border-b-md-outline'
          }
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-md-tertiary">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-md-on-background/70">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';