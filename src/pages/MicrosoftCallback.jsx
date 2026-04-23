import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui/Spinner';

export const MicrosoftCallback = () => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get error from URL parameters
        const params = new URLSearchParams(window.location.search);
        const authError = params.get('authError');

        if (authError) {
          console.error('Microsoft OAuth error:', authError);
          // Redirect to home with error message
          navigate('/', { replace: true });
          return;
        }

        // Initialize auth to fetch current user from backend
        // Backend already set cookies, so just refresh auth state
        await initializeAuth();

        // Redirect to home
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Microsoft callback error:', error);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, initializeAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-600">Completing Microsoft login...</p>
      </div>
    </div>
  );
};

export default MicrosoftCallback;
