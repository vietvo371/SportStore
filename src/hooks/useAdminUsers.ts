import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, adminKeys } from '@/services/admin.service';
import { toast } from 'sonner';

export const userKeys = {
    all: [...adminKeys.all, 'users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params: any) => [...userKeys.lists(), params] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
};

export function useAdminUsers(params: any = {}) {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => adminService.getUsers(params),
    });
}

export function useAdminUser(id: number | null) {
    return useQuery({
        queryKey: userKeys.detail(id!),
        queryFn: () => adminService.getUser(id!),
        enabled: !!id,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => adminService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            toast.success('Đã cập nhật thông tin người dùng thành công');
        },
        onError: (error: any) => {
            if (error.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                toast.error(firstError[0] || 'Dữ liệu không hợp lệ');
            } else {
                toast.error(error.message || 'Không thể cập nhật người dùng');
            }
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('Đã xóa người dùng thành công');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không thể xóa người dùng');
        },
    });
}
