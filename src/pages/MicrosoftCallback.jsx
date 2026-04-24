import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui/Spinner';
import { setStoredAuthTokens } from '../api/client';

export const MicrosoftCallback = () => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const authError = params.get('authError');

        if (authError) {
          console.error('Microsoft OAuth error:', authError);
          navigate('/', { replace: true });
          return;
        }

        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('accessToken');
        const refreshToken = hashParams.get('refreshToken');

        if (accessToken) {
          setStoredAuthTokens({ accessToken, refreshToken: refreshToken || '' });
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }

        await initializeAuth();
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
