import apiClient from '@/lib/api';
import { PaginatedResponse, ApiResponse } from '@/types/api.types';
import { Product } from '@/types/product.types';

export interface GetProductsParams {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
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

    getProducts: async (params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> => {
        try {
            // Map frontend params to backend expected params
            const apiParams: Record<string, string | number | boolean | undefined> = { ...params };

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
            if (params.minPrice !== undefined) {
                apiParams.gia_min = params.minPrice;
                delete apiParams.minPrice;
            }
            if (params.maxPrice !== undefined) {
                apiParams.gia_max = params.maxPrice;
                delete apiParams.maxPrice;
            }

            const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params: apiParams });
            return response as unknown as PaginatedResponse<Product>;
        } catch (error) {
            console.error('Failed to fetch products API:', error);
            throw error;
        }
    },

    getProductBySlug: async (slug: string): Promise<Product> => {
        try {
            const response = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
            return (response as unknown as ApiResponse<Product>).data;
        } catch (error) {
            console.error(`Failed to fetch product ${slug}:`, error);
            throw error;
        }
    },

    getSizeCharts: async (params: { loai: string; thuong_hieu_id?: number }): Promise<any[]> => {
        try {
            const response = await apiClient.get<ApiResponse<any[]>>('/size-charts', { params });
            return (response as unknown as ApiResponse<any[]>).data;
        } catch (error) {
            console.error('Failed to fetch size charts:', error);
            return [];
        }
    },
};
