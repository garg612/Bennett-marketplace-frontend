export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-md-secondary-container text-md-primary">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
      )}
      <h3 className="mb-2 text-card-title font-medium text-md-on-background">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-md-on-background/70">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};