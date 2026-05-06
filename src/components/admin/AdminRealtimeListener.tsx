'use client';

import { useEcho } from '@/hooks/useEcho';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function AdminRealtimeListener() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    useEcho(
        user ? 'private-admin' : '',
        'NewOrderReceived',
        (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin'] });
            toast.info(`🛒 Đơn hàng mới #${data.ma_don_hang} - ${data.ten_khach}`, {
                description: `${Number(data.tong_tien).toLocaleString('vi-VN')}đ`,
            });
        },
        !!user
    );

    useEcho(
        user ? 'private-admin' : '',
        'OrderPaid',
        (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin'] });
            toast.success(`💳 Đơn #${data.ma_don_hang} đã thanh toán`, {
                description: `${Number(data.tong_tien).toLocaleString('vi-VN')}đ`,
            });
        },
        !!user
    );

    return null;
}
