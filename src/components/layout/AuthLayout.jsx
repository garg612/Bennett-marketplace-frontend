import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';

export const AuthLayout = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="mx-auto mt-6 flex min-h-[40vh] w-[min(1280px,100%-3rem)] items-center justify-center rounded-[24px] bg-md-surface-container p-6 shadow-md-sm">
        <Spinner />
      </div>
    );
  }

  // The 'replace' prop replaces the current history entry, 
  // so the user can't just click the "Back" button to bypass the auth check!
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};