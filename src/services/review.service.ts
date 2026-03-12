import apiClient from '@/lib/api';

export interface ReviewSubmitData {
    san_pham_id: number;
    don_hang_id: number | null;
    so_sao: number;
    tieu_de: string | null;
    noi_dung: string | null;
}

export const reviewService = {
    submitReview: async (data: ReviewSubmitData) => {
        try {
            const response: any = await apiClient.post('/reviews', data);
            return response;
        } catch (error) {
            console.error('Failed to submit review:', error);
            throw error;
        }
    }
};
