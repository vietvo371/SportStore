import apiClient from '@/lib/api';
import { CouponPayload, CouponResponse } from '@/types/coupon.types';

export const couponService = {
    validateCoupon: async (payload: CouponPayload): Promise<CouponResponse> => {
        const response: any = await apiClient.post('/coupons/validate', payload);
        // Assuming ApiResponse struct: response.data is the payload if successfully unwrapped by interceptor
        return response.data;
    },
};
