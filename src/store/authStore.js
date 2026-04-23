import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

let authInitializationPromise = null;

export const useAuthStore = create(persist(
    (set) => ({
        isAuthenticated: false,
        user: null,
        isAuthLoading: false,
        login: (userData) => set({ isAuthenticated: true, user: userData }),
        logout: async () => {
            try {
                await authService.logout();
            } finally {
                set({ isAuthenticated: false, user: null });
            }
        },
        initializeAuth: async () => {
            if (authInitializationPromise) {
                return authInitializationPromise;
            }

            authInitializationPromise = (async () => {
                set({ isAuthLoading: true });
                try {
                    const user = await authService.getCurrentUser();
                    set({ isAuthenticated: Boolean(user), user });
                    return user;
                } catch {
                    set({ isAuthenticated: false, user: null });
                    return null;
                } finally {
                    set({ isAuthLoading: false });
                    authInitializationPromise = null;
                }
            })();

            return authInitializationPromise;
        },
    }),
    {
        name: 'auth-storage', // name of the item in storage
        getStorage: () => localStorage, // use localStorage for persistence
        partialize: (state) => ({
            isAuthenticated: state.isAuthenticated,
            user: state.user
        }),
        merge: (persistedState, currentState) => ({
            ...currentState,
            isAuthenticated: persistedState?.isAuthenticated ?? currentState.isAuthenticated,
            user: persistedState?.user ?? currentState.user
        })
    }
));