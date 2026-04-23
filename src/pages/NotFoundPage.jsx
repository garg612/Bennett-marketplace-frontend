import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1280px] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 rounded-[24px] bg-md-tertiary p-6 text-md-on-tertiary shadow-md-md">
        <FileQuestion className="h-16 w-16" />
      </div>
      <h1 className="mb-4 text-subtitle font-medium tracking-tight text-md-on-background sm:text-section">
        404 - Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-body text-md-on-background/75">
        Oops! It looks like you've wandered off the campus map. The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg">Return to Homepage</Button>
      </Link>
    </div>
  );
};