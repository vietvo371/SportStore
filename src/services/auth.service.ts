import apiClient from '@/lib/api';
import { AuthResponse } from '@/types/auth.types';

export const authService = {
    login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
        try {
            const response: any = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    register: async (data: Record<string, string>): Promise<AuthResponse> => {
        try {
            const response: any = await apiClient.post('/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },

    getMe: async (): Promise<any> => {
        const response: any = await apiClient.get('/auth/me');
        return response.data;
    },

    updateProfile: async (data: Record<string, string>): Promise<any> => {
        const response: any = await apiClient.put('/auth/me', data);
        return response.data;
    },

    // Google OAuth
    getGoogleRedirectUrl: async (): Promise<string> => {
        const response: any = await apiClient.get('/auth/google/redirect');
        return response.data.url;
    },

    loginWithGoogle: async (code: string) => {
        const res = await apiClient.post('/auth/google/callback', { code });
        return res.data;
    },

    resendVerificationEmail: async (token?: string) => {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res: any = await apiClient.post('/auth/email/resend', {}, config);
        return res.data;
    },

    // Password Reset
    forgotPassword: async (email: string) => {
        const res: any = await apiClient.post('/auth/password/email', { email });
        return res.data;
    },

    resetPassword: async (data: any) => {
        const res: any = await apiClient.post('/auth/password/reset', data);
        return res.data;
    }
};
