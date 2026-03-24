import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService } from '@/services/rbac.service';
import { toast } from 'sonner';

export const useAdminRoles = () => {
    const queryClient = useQueryClient();

    /**
     * Lấy danh sách vai trò
     */
    const rolesQuery = useQuery({
        queryKey: ['admin-roles'],
        queryFn: () => rbacService.getRoles()
    });

    /**
     * Lấy danh sách quyền hạn
     */
    const permissionsQuery = useQuery({
        queryKey: ['admin-permissions'],
        queryFn: () => rbacService.getPermissions()
    });

    /**
     * Lấy chi tiết một vai trò
     */
    const useRoleDetails = (id?: number) => useQuery({
        queryKey: ['admin-roles', id],
        queryFn: () => rbacService.getRole(id!),
        enabled: !!id
    });

    /**
     * Mutation: Tạo vai trò
     */
    const createRoleMutation = useMutation({
        mutationFn: rbacService.createRole,
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message || 'Đã tạo vai trò mới');
                queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
            } else {
                toast.error(res.message || 'Lỗi khi tạo vai trò');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    });

    /**
     * Mutation: Cập nhật vai trò
     */
    const updateRoleMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => rbacService.updateRole(id, data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message || 'Đã cập nhật vai trò');
                queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
                queryClient.invalidateQueries({ queryKey: ['admin-roles', res.data.id] });
            } else {
                toast.error(res.message || 'Lỗi khi cập nhật vai trò');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    });

    /**
     * Mutation: Xóa vai trò
     */
    const deleteRoleMutation = useMutation({
        mutationFn: rbacService.deleteRole,
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message || 'Đã xóa vai trò');
                queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
            } else {
                toast.error(res.message || 'Lỗi khi xóa vai trò');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    });

    return {
        roles: rolesQuery.data?.data || [],
        isLoadingRoles: rolesQuery.isLoading,
        rolesError: rolesQuery.error,
        permissions: permissionsQuery.data?.data || {},
        isLoadingPermissions: permissionsQuery.isLoading,
        createRole: createRoleMutation.mutateAsync,
        isCreating: createRoleMutation.isPending,
        updateRole: updateRoleMutation.mutateAsync,
        isUpdating: updateRoleMutation.isPending,
        deleteRole: deleteRoleMutation.mutateAsync,
        isDeleting: deleteRoleMutation.isPending,
        useRoleDetails,
        refreshRoles: () => queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
    };
};
