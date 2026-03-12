import apiClient from '@/lib/api';
import { ApiResponse } from '@/types/api.types';
import { Category } from '@/types/category.types';

export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        try {
            // Because of the api client interceptor, the response is unwrapped.
            // But we defined ApiResponse to match the backend structure which wraps the actual category list.
            const response: any = await apiClient.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            return [];
        }
    },

    getCategoryBySlug: async (slug: string): Promise<Category> => {
        try {
            const response: any = await apiClient.get(`/categories/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch category ${slug}:`, error);
            throw error;
        }
    },
};
