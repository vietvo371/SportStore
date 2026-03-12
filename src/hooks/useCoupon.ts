import { useMutation } from '@tanstack/react-query';
import { couponService } from '@/services/coupon.service';
import { CouponPayload } from '@/types/coupon.types';

export const useCoupon = () => {
    const validateMutation = useMutation({
        mutationFn: (payload: CouponPayload) => couponService.validateCoupon(payload),
    });

    return {
        validateCoupon: validateMutation.mutateAsync,
        isValidating: validateMutation.isPending,
    };
};
