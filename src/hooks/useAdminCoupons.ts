import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, adminKeys } from '@/services/admin.service';
import { toast } from 'sonner';

export const couponKeys = {
    all: [...adminKeys.all, 'coupons'] as const,
    lists: () => [...couponKeys.all, 'list'] as const,
    list: (params: any) => [...couponKeys.lists(), params] as const,
    details: () => [...couponKeys.all, 'detail'] as const,
    detail: (id: number) => [...couponKeys.details(), id] as const,
};

export function useAdminCoupons(params: any = {}) {
    return useQuery({
        queryKey: couponKeys.list(params),
        queryFn: () => adminService.getCoupons(params),
    });
}

export function useAdminCoupon(id: number | null) {
    return useQuery({
        queryKey: couponKeys.detail(id!),
        queryFn: () => adminService.getCoupon(id!),
        enabled: !!id,
    });
}

export function useCreateCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => adminService.createCoupon(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
            toast.success('Đã tạo mã giảm giá thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể tạo mã giảm giá');
        },
    });
}

export function useUpdateCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => adminService.updateCoupon(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: couponKeys.all });
            toast.success('Đã cập nhật mã giảm giá thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
        },
    });
}

export function useDeleteCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteCoupon(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
            toast.success('Đã xóa mã giảm giá thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
        },
    });
}
