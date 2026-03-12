import apiClient from '@/lib/api';
import { Order, OrderPayload } from '@/types/order.types';
import { PaginatedResponse, ApiResponse } from '@/types/api.types';

export const orderService = {
    getOrders: async (page = 1, limit = 10): Promise<PaginatedResponse<Order>> => {
        const response: any = await apiClient.get('/orders', { params: { page, limit } });
        return response;
    },

    getOrderDetails: async (code: string): Promise<ApiResponse<Order>> => {
        const response: any = await apiClient.get(`/orders/${code}`);
        return response; // The inner data object is expected in components, wait actually let's look at Order interface vs ApiResponse
    },

    placeOrder: async (payload: OrderPayload): Promise<ApiResponse<Order>> => {
        const response: any = await apiClient.post('/orders', payload);
        return response;
    },
};
