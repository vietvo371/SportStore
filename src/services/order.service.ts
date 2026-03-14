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

    createPaymentUrl: async (ma_don_hang: string, phuong_thuc: 'vnpay' | 'momo'): Promise<ApiResponse<{ payment_url: string }>> => {
        const response: any = await apiClient.post('/payments/create-url', { ma_don_hang, phuong_thuc });
        return response;
    },

    verifyVNPayReturn: async (params: any): Promise<ApiResponse<any>> => {
        const response: any = await apiClient.get('/payments/vnpay-return', { params });
        return response;
    },

    verifyMomoReturn: async (params: any): Promise<ApiResponse<any>> => {
        const response: any = await apiClient.get('/payments/momo-return', { params });
        return response;
    },
};
