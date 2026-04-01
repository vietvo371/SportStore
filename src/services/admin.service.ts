import apiClient from "@/lib/api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { Product } from "@/types/product.types";

export interface DashboardStats {
    stats: {
        total_revenue: number;
        total_orders: number;
        total_products: number;
        total_users: number;
    };
    charts: {
        revenue: Array<{ month: string; total: number }>;
        category_distribution: Array<{ name: string; value: number }>;
    };
    top_products: Array<{
        id: number;
        ten_san_pham: string;
        total_sold: number;
    }>;
    recent_orders: Array<{
        id: number;
        ma_don_hang: string;
        khach_hang: string;
        tong_tien: number;
        trang_thai: string;
        thoi_gian: string;
    }>;
}

export const adminService = {
    getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
        return apiClient.get('/admin/dashboard');
    },



    // Products
    getProducts: async (params: any = {}): Promise<PaginatedResponse<Product>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/products${queryString ? `?${queryString}` : ''}`);
    },
    getProduct: async (id: number): Promise<ApiResponse<Product>> => {
        return apiClient.get(`/admin/products/${id}`);
    },
    createProduct: async (data: any): Promise<ApiResponse<Product>> => {
        return apiClient.post('/admin/products', data);
    },
    updateProduct: async (id: number, data: any): Promise<ApiResponse<Product>> => {
        return apiClient.put(`/admin/products/${id}`, data);
    },
    deleteProduct: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/products/${id}`);
    },

    // Metadata for forms
    getAllCategories: async (): Promise<ApiResponse<any[]>> => {
        return apiClient.get('/categories');
    },
    getAllBrands: async (): Promise<ApiResponse<any[]>> => {
        return apiClient.get('/brands');
    },

    // Upload
    uploadImage: async (file: File, folder: string = 'products'): Promise<ApiResponse<{ url: string; path: string; filename: string }>> => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        return apiClient.post('/admin/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Orders
    getOrders: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/orders${queryString ? `?${queryString}` : ''}`);
    },
    getOrder: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/orders/${id}`);
    },
    updateOrderStatus: async (id: number, data: { trang_thai: string; ghi_chu?: string }): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/orders/${id}/status`, data);
    },

    // Reviews
    getReviews: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
    },
    approveReview: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/reviews/${id}/approve`);
    },
    deleteReview: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/reviews/${id}`);
    },

    // Coupons
    getCoupons: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/coupons${queryString ? `?${queryString}` : ''}`);
    },
    getCoupon: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/coupons/${id}`);
    },
    createCoupon: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post('/admin/coupons', data);
    },
    updateCoupon: async (id: number, data: any): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/coupons/${id}`, data);
    },
    deleteCoupon: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/coupons/${id}`);
    },

    // Users
    getUsers: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/users${queryString ? `?${queryString}` : ''}`);
    },
    getUser: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/users/${id}`);
    },
    createUser: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post('/admin/users', data);
    },
    updateUser: async (id: number, data: any): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/users/${id}`, data);
    },
    deleteUser: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/users/${id}`);
    },

    // Admin Categories
    adminGetCategories: async (params: any = {}): Promise<ApiResponse<any[]>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        // Dùng đúng route API /admin/categories
        return apiClient.get(`/admin/categories${queryString ? `?${queryString}` : ''}`);
    },
    adminGetCategory: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/categories/${id}`);
    },
    adminCreateCategory: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post('/admin/categories', data);
    },
    adminUpdateCategory: async (id: number, data: any): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/categories/${id}`, data);
    },
    adminDeleteCategory: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/categories/${id}`);
    },

    // Admin Brands
    adminGetBrands: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        // Dùng đúng route API /admin/brands
        return apiClient.get(`/admin/brands${queryString ? `?${queryString}` : ''}`);
    },
    adminGetBrand: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/brands/${id}`);
    },
    adminCreateBrand: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post('/admin/brands', data);
    },
    adminUpdateBrand: async (id: number, data: any): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/brands/${id}`, data);
    },
    adminDeleteBrand: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/brands/${id}`);
    },

    // Banners
    getBanners: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/banners${queryString ? `?${queryString}` : ''}`);
    },
    getBanner: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/banners/${id}`);
    },
    createBanner: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post('/admin/banners', data);
    },
    updateBanner: async (id: number, data: any): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/banners/${id}`, data);
    },
    deleteBanner: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/banners/${id}`);
    },
    toggleBannerStatus: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.patch(`/admin/banners/${id}/status`);
    },

    // Size Charts
    getSizeCharts: async (params: any = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        return apiClient.get(`/admin/size-charts${queryString ? `?${queryString}` : ''}`);
    },
    getSizeChart: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`/admin/size-charts/${id}`);
    },
    createSizeChart: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post('/admin/size-charts', data);
    },
    updateSizeChart: async (id: number, data: any): Promise<ApiResponse<any>> => {
        return apiClient.put(`/admin/size-charts/${id}`, data);
    },
    deleteSizeChart: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete(`/admin/size-charts/${id}`);
    },
};

export const adminKeys = {
    all: ['admin'] as const,
};
