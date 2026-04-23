export const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '' 
}) => {
  const baseStyles = "inline-flex min-h-[24px] items-center rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ease-material";
  
  const variants = {
    primary: "bg-md-primary text-md-on-primary",
    secondary: "bg-md-secondary-container text-md-on-secondary-container",
    success: "bg-md-secondary-container text-md-on-secondary-container",
    warning: "bg-md-tertiary/15 text-md-tertiary",
    danger: "bg-md-tertiary/15 text-md-tertiary",
    outline: "border border-md-outline text-md-on-background",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};