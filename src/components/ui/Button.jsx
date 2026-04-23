import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex min-h-[44px] items-center justify-center rounded-full font-medium transition-all duration-300 ease-material focus-ring disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "bg-transparent text-md-on-background hover:bg-md-secondary-container/60 active:scale-95",
    danger: "bg-md-tertiary text-md-on-tertiary hover:bg-md-tertiary/90 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-body",
    lg: "px-6 py-3 text-label",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};