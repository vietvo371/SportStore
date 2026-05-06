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
    },

    getBadWords: async (): Promise<string[]> => {
        try {
            const response: any = await apiClient.get('/admin/reviews/bad-words');
            return response.data || response || [];
        } catch (error) {
            return [];
        }
    },

    containsBadWords: (text: string, badWords: string[]): string[] => {
        const normalizedText = text.toLowerCase().normalize('NFC');
        return badWords.filter(word =>
            normalizedText.includes(word.toLowerCase().normalize('NFC'))
        );
    }
};
