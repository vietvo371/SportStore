import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/types/auth.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                // Also set in Cookies for middleware / SSR usage later if needed
                Cookies.set('token', token, { expires: 30 });
                Cookies.set('user', JSON.stringify(user), { expires: 30 });

                set({ user, token, isAuthenticated: true });
            },

            updateUser: (updatedData) => set((state) => {
                if (!state.user) return state;
                const newUser = { ...state.user, ...updatedData };
                Cookies.set('user', JSON.stringify(newUser), { expires: 30 });
                return { user: newUser };
            }),

            logout: () => {
                Cookies.remove('token');
                Cookies.remove('user');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // saves to localStorage so state persists across reloads
        }
    )
);
