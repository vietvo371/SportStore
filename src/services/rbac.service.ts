import apiClient from '@/lib/api';
import { ApiResponse } from '@/types/api.types';
import { Role, Permission } from '@/types/auth.types';

export const rbacService = {
    /**
     * Lấy danh sách vai trò
     */
    async getRoles(): Promise<ApiResponse<Role[]>> {
        return apiClient.get('/admin/roles') as any;
    },

    /**
     * Lấy chi tiết vai trò
     */
    async getRole(id: number): Promise<ApiResponse<Role>> {
        return apiClient.get(`/admin/roles/${id}`) as any;
    },

    /**
     * Tạo vai trò mới
     */
    async createRole(data: { ten: string; ma_slug?: string; quyen_ids?: number[] }): Promise<ApiResponse<Role>> {
        return apiClient.post('/admin/roles', data) as any;
    },

    /**
     * Cập nhật vai trò
     */
    async updateRole(id: number, data: { ten: string; ma_slug?: string; quyen_ids?: number[] }): Promise<ApiResponse<Role>> {
        return apiClient.put(`/admin/roles/${id}`, data) as any;
    },

    /**
     * Xóa vai trò
     */
    async deleteRole(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete(`/admin/roles/${id}`) as any;
    },

    /**
     * Lấy danh sách quyền hạn (phân nhóm)
     */
    async getPermissions(): Promise<ApiResponse<Record<string, Permission[]>>> {
        return apiClient.get('/admin/permissions') as any;
    }
};
