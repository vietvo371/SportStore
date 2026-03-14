import { useEffect, useRef } from 'react';
import { recommendationService, BehaviorType, RecordBehaviorData } from '@/services/recommendation.service';

export const useBehaviorTracking = () => {
    // Để tránh track "xem" (view) nhiều lần liên tục cho cùng một sản phẩm trong 1 lần render
    const trackedViews = useRef<Set<number>>(new Set());

    const trackAction = async (san_pham_id: number, hanh_vi: BehaviorType, duration?: number) => {
        if (!san_pham_id) return;
        
        // Nếu là hành vi 'xem', chặn lại nếu đã gửi trong lifecycle component này
        if (hanh_vi === 'xem') {
            if (trackedViews.current.has(san_pham_id)) return;
            trackedViews.current.add(san_pham_id);
        }

        const data: RecordBehaviorData = {
            san_pham_id,
            hanh_vi,
            ...(duration ? { thoi_gian_xem_s: duration } : {})
        };

        // Gửi ngầm không làm gián đoạn UI
        recommendationService.recordBehavior(data).catch(() => {});
    };

    /**
     * Hook để tự động track hành vi "xem" khi component mount
     * @param productId ID sản phẩm
     * @param duration Thời gian tính bằng giây (Tuỳ chọn)
     */
    const useTrackView = (productId?: number, duration?: number) => {
        useEffect(() => {
            if (productId) {
                trackAction(productId, 'xem', duration);
            }
        }, [productId, duration]);
    };

    return { trackAction, useTrackView };
};
