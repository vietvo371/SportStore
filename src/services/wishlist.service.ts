import apiClient from '@/lib/api';
import { PaginatedResponse } from '@/types';
import { WishlistItem } from '@/types/wishlist.types';

export const wishlistService = {
    getWishlist: async (page: number = 1): Promise<PaginatedResponse<WishlistItem>> => {
        const response: any = await apiClient.get('/wishlist', {
            params: { page }
        });
        return response;
    },

    toggleWishlist: async (productId: number): Promise<void> => {
        const response: any = await apiClient.post(`/wishlist/${productId}`);
        return response;
    },
};
