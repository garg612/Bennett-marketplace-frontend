
import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

function App(){
  const { initializeAuth } = useAuth();

  uuseEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("accessToken", token);

    // clean URL
    window.history.replaceState({}, document.title, "/");
  }
}, []);

  return (
    <ErrorBoundary>
      <AppRouter />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
