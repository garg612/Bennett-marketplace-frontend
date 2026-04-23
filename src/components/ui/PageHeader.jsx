export const PageHeader = ({ 
  title, 
  subtitle, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${className}`}>
      <div>
        <h1 className="text-subtitle font-medium tracking-tight text-md-on-background sm:text-section">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-body text-md-on-background/75">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Right-aligned action area (e.g., a button) */}
      {action && (
        <div className="w-full sm:w-auto shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};