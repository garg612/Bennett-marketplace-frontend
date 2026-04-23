import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
    const { isAuthenticated, user, isAuthLoading, login, logout, initializeAuth } = useAuthStore();

    return {
        isAuthenticated,
        isAuthLoading,
        user,
        login,
        logout,
        initializeAuth
    };
}