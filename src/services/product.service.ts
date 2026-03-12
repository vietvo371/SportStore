import apiClient from '@/lib/api';
import { PaginatedResponse } from '@/types/api.types';
import { Product } from '@/types/product.types';

export interface GetProductsParams {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export const productService = {
    getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
        try {
            // Assuming a GET /products endpoint handles featured or basic list
            // The interceptor unwraps the axios response.
            const response: PaginatedResponse<Product> = await apiClient.get('/products', {
                params: { limit, noi_bat: 1, sort: 'newest' },
            });
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
            return [];
        }
    },

    getProducts: async (params: any = {}): Promise<PaginatedResponse<Product>> => {
        try {
            // Map frontend params to backend expected params
            const apiParams: Record<string, any> = { ...params };

            if (params.category) {
                apiParams.danh_muc = params.category;
                delete apiParams.category;
            }
            if (params.brand) {
                apiParams.thuong_hieu = params.brand;
                delete apiParams.brand;
            }
            if (params.search) {
                apiParams.tu_khoa = params.search;
                delete apiParams.search;
            }

            const response: any = await apiClient.get('/products', { params: apiParams });
            return response as PaginatedResponse<Product>;
        } catch (error) {
            console.error('Failed to fetch products API:', error);
            throw error;
        }
    },

    getProductBySlug: async (slug: string): Promise<Product> => {
        try {
            const response: any = await apiClient.get(`/products/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch product ${slug}:`, error);
            throw error;
        }
    },
};
