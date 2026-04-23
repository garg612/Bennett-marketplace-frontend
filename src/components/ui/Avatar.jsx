import { useState } from 'react';

export const Avatar = ({
  src,
  alt,
  name = 'User',
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Helper to extract up to 2 initials from a name
  const getInitials = (nameString) => {
    if (!nameString) return '?';
    const parts = nameString.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-md-secondary-container text-md-primary font-medium ${sizes[size]} ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};