import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, adminKeys } from "@/services/admin.service";
import { toast } from "sonner";

export const adminOrderKeys = {
    all: [...adminKeys.all, 'orders'] as const,
    list: (params: any) => [...adminOrderKeys.all, 'list', params] as const,
    detail: (id: number) => [...adminOrderKeys.all, 'detail', id] as const,
};

export function useAdminOrders(params: any = {}) {
    return useQuery({
        queryKey: adminOrderKeys.list(params),
        queryFn: () => adminService.getOrders(params),
    });
}

export function useAdminOrder(id: number | null) {
    return useQuery({
        queryKey: adminOrderKeys.detail(id!),
        queryFn: () => adminService.getOrder(id!),
        enabled: !!id,
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { trang_thai: string; ghi_chu?: string } }) =>
            adminService.updateOrderStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
            toast.success("Cập nhật trạng thái đơn hàng thành công");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái";
            toast.error(message);
        },
    });
}
