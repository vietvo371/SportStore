import api from '@/lib/api';
import { ApiResponse } from '@/types/api.types';
import { Cart, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types';

export const cartService = {
    /**
     * Get current user's cart containing items and totals
     */
    getCart: async (): Promise<Cart | null> => {
        try {
            const response = await api.get<any, ApiResponse<Cart>>('/cart');
            return response.data;
        } catch (error: any) {
            // Cart might not exist or user unauthenticated
            return null;
        }
    },

    /**
     * Add an item to the cart
     */
    addItem: async (payload: AddToCartPayload): Promise<Cart> => {
        const response = await api.post<any, ApiResponse<Cart>>('/cart/items', payload);
        return response.data;
    },

    /**
     * Update quantity of a specific cart item
     */
    updateItem: async (itemId: number, payload: UpdateCartItemPayload): Promise<Cart> => {
        const response = await api.put<any, ApiResponse<Cart>>(`/cart/items/${itemId}`, payload);
        return response.data;
    },

    /**
     * Remove an item from the cart
     */
    removeItem: async (itemId: number): Promise<Cart> => {
        const response = await api.delete<any, ApiResponse<Cart>>(`/cart/items/${itemId}`);
        return response.data;
    },

    /**
     * Clear the entire cart
     */
    clearCart: async (): Promise<boolean> => {
        const response = await api.delete<any, ApiResponse<null>>('/cart');
        return response.success;
    }
};
