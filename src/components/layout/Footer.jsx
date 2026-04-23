import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-md-outline/35 bg-md-surface-container py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-6 lg:flex-row lg:items-center">
        <span className="text-card-title font-medium tracking-tight text-md-on-background">
          Bennett Marketplace
        </span>

        <p className="text-sm text-md-on-background/75">
          © {new Date().getFullYear()} Bennett Marketplace. All rights reserved.
        </p>

        <div className="flex items-center space-x-6">
          <Link to="/" className="focus-ring rounded-full px-2 py-1 text-sm font-medium text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary">Home</Link>
          <Link to="/listings" className="focus-ring rounded-full px-2 py-1 text-sm font-medium text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary">Browse Listings</Link>
          <Link to="/listings" className="focus-ring rounded-full px-2 py-1 text-sm font-medium text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary">Campus Deals</Link>
        </div>
      </div>
    </footer>
  );
};