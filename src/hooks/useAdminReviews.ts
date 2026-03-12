import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, adminKeys } from '@/services/admin.service';
import { toast } from 'sonner';

export const reviewKeys = {
    all: [...adminKeys.all, 'reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (params: any) => [...reviewKeys.lists(), params] as const,
};

export function useAdminReviews(params: any = {}) {
    return useQuery({
        queryKey: reviewKeys.list(params),
        queryFn: () => adminService.getReviews(params),
    });
}

export function useApproveReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.approveReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            toast.success('Đã duyệt đánh giá thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể duyệt đánh giá');
        },
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            toast.success('Đã xóa đánh giá thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể xóa đánh giá');
        },
    });
}
