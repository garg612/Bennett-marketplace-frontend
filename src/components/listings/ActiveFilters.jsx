import { X } from 'lucide-react';

export const ActiveFilters = ({ category, condition, verification, onClearCategory, onClearCondition, onClearVerification }) => {
  if (!category && !condition && !verification) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="mr-2 text-sm font-medium text-md-on-background/75">Active Filters:</span>
      
      {category && (
        <span className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-md-secondary-container px-3 py-1 text-sm font-medium text-md-on-secondary-container">
          {category}
          <button
            onClick={onClearCategory}
            aria-label="Clear category filter"
            className="focus-ring rounded-full p-0.5 transition-colors duration-300 ease-material hover:bg-md-primary hover:text-md-on-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {condition && (
        <span className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-md-secondary-container px-3 py-1 text-sm font-medium text-md-on-secondary-container">
          {condition}
          <button
            onClick={onClearCondition}
            aria-label="Clear condition filter"
            className="focus-ring rounded-full p-0.5 transition-colors duration-300 ease-material hover:bg-md-primary hover:text-md-on-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {verification && (
        <span className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-md-secondary-container px-3 py-1 text-sm font-medium text-md-on-secondary-container">
          {verification === 'verified' ? 'Verified Sellers' : 'Unverified Sellers'}
          <button
            onClick={onClearVerification}
            aria-label="Clear verification filter"
            className="focus-ring rounded-full p-0.5 transition-colors duration-300 ease-material hover:bg-md-primary hover:text-md-on-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  );
};