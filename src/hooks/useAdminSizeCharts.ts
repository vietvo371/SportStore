import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, adminKeys } from '@/services/admin.service';
import { toast } from 'sonner';

export const sizeChartKeys = {
    all: [...adminKeys.all, 'size-charts'] as const,
    lists: () => [...sizeChartKeys.all, 'list'] as const,
    list: (params: any) => [...sizeChartKeys.lists(), params] as const,
    details: () => [...sizeChartKeys.all, 'detail'] as const,
    detail: (id: number) => [...sizeChartKeys.details(), id] as const,
};

export function useAdminSizeCharts(params: any = {}) {
    return useQuery({
        queryKey: sizeChartKeys.list(params),
        queryFn: () => adminService.getSizeCharts(params),
    });
}

export function useAdminSizeChart(id: number | null) {
    return useQuery({
        queryKey: sizeChartKeys.detail(id!),
        queryFn: () => adminService.getSizeChart(id!),
        enabled: !!id,
    });
}

export function useCreateSizeChart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => adminService.createSizeChart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sizeChartKeys.lists() });
            toast.success('Đã tạo quy tắc size thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể tạo quy tắc size');
        },
    });
}

export function useUpdateSizeChart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => adminService.updateSizeChart(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sizeChartKeys.all });
            toast.success('Đã cập nhật quy tắc size thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể cập nhật quy tắc size');
        },
    });
}

export function useDeleteSizeChart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteSizeChart(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sizeChartKeys.lists() });
            toast.success('Đã xóa quy tắc size thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể xóa quy tắc size');
        },
    });
}
