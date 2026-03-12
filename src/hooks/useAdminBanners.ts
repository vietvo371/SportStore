import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, adminKeys } from '@/services/admin.service';
import { toast } from 'sonner';

export const bannerKeys = {
    all: [...adminKeys.all, 'banners'] as const,
    lists: () => [...bannerKeys.all, 'list'] as const,
    list: (params: any) => [...bannerKeys.lists(), params] as const,
    details: () => [...bannerKeys.all, 'detail'] as const,
    detail: (id: number) => [...bannerKeys.details(), id] as const,
};

export function useAdminBanners(params: any = {}) {
    return useQuery({
        queryKey: bannerKeys.list(params),
        queryFn: () => adminService.getBanners(params),
    });
}

export function useAdminBanner(id: number | null) {
    return useQuery({
        queryKey: bannerKeys.detail(id!),
        queryFn: () => adminService.getBanner(id!),
        enabled: !!id,
    });
}

export function useCreateBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => adminService.createBanner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            toast.success('Đã tạo banner thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể tạo banner');
        },
    });
}

export function useUpdateBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => adminService.updateBanner(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.all });
            toast.success('Đã cập nhật banner thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể cập nhật banner');
        },
    });
}

export function useDeleteBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            toast.success('Đã xóa banner thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể xóa banner');
        },
    });
}

export function useToggleBannerStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.toggleBannerStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
            toast.success('Đã thay đổi trạng thái banner');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể thay đổi trạng thái banner');
        },
    });
}
