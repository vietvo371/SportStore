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
            const response: PaginatedResponse<Product> = await apiClient.get('/products', {
                params: { per_page: limit, noi_bat: 1, sort: 'moi_nhat' },
            });
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
            return [];
        }
    },

    getProducts: async (params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> => {
        try {
            const apiParams: Record<string, string | number | boolean | undefined> = {};

            if (params.page) apiParams.page = params.page;
            if (params.limit) apiParams.per_page = params.limit;
            if (params.category) apiParams.danh_muc = params.category;
            if (params.brand) apiParams.thuong_hieu = params.brand;
            if (params.search) apiParams.tu_khoa = params.search;
            if (params.minPrice !== undefined) apiParams.gia_min = params.minPrice;
            if (params.maxPrice !== undefined) apiParams.gia_max = params.maxPrice;
            if (params.sort) {
                apiParams.sap_xep = {
                    newest: 'moi_nhat',
                    price_asc: 'gia_tang',
                    price_desc: 'gia_giam',
                    popular: 'ban_chay',
                }[params.sort];
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

    searchProducts: async (keyword: string, limit: number = 8): Promise<Product[]> => {
        try {
            const response: PaginatedResponse<Product> = await apiClient.get('/products', {
                params: { tu_khoa: keyword, per_page: limit, sort: 'moi_nhat' },
            });
            return response.data || [];
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    },
};
