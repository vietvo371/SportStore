import apiClient from '@/lib/api';
import { Product } from '@/types/product.types';
import { ApiResponse } from '@/types/api.types';

export type BehaviorType = 'xem' | 'click' | 'them_gio_hang' | 'mua_hang' | 'yeu_thich';

export interface RecordBehaviorData {
    san_pham_id: number;
    hanh_vi: BehaviorType;
    thoi_gian_xem_s?: number;
}

export const recommendationService = {
    /**
     * Lấy danh sách sản phẩm gợi ý (có personalize nếu đã đăng nhập)
     */
    getRecommendations: async (): Promise<Product[]> => {
        try {
            const response: any = await apiClient.get('/recommendations');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            return [];
        }
    },

    /**
     * Lấy danh sách sản phẩm tương tự (dùng cho trang chi tiết sản phẩm)
     */
    getRelatedProducts: async (productId: number): Promise<Product[]> => {
        try {
            const response: any = await apiClient.get(`/recommendations/${productId}/related`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch related products:', error);
            return [];
        }
    },

    /**
     * Ghi nhận hành vi người dùng đối với sản phẩm cụ thể
     */
    recordBehavior: async (data: RecordBehaviorData): Promise<void> => {
        try {
            await apiClient.post('/behaviors', data);
        } catch (error) {
            console.error('Failed to record behavior:', error);
        }
    }
};
