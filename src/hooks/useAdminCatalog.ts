import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

// --- Categories ---

export function useAdminCategories(params: any = {}) {
    return useQuery({
        queryKey: ["admin", "categories", params],
        queryFn: () => adminService.adminGetCategories(params),
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => adminService.adminCreateCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            toast.success("Đã tạo danh mục mới");
        },
        onError: (error: any) => {
            if (error.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                toast.error(firstError[0] || "Dữ liệu không hợp lệ");
            } else {
                toast.error(error.message || "Lỗi khi tạo danh mục");
            }
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            adminService.adminUpdateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            toast.success("Đã cập nhật danh mục");
        },
        onError: (error: any) => {
            if (error.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                toast.error(firstError[0] || "Dữ liệu không hợp lệ");
            } else {
                toast.error(error.message || "Lỗi khi cập nhật danh mục");
            }
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => adminService.adminDeleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            toast.success("Đã xóa danh mục");
        },
        onError: (error: any) => {
            toast.error(error.message || "Lỗi khi xóa danh mục");
        },
    });
}

// --- Brands ---

export function useAdminBrands(params: any = {}) {
    return useQuery({
        queryKey: ["admin", "brands", params],
        queryFn: () => adminService.adminGetBrands(params),
    });
}

export function useCreateBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => adminService.adminCreateBrand(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
            toast.success("Đã tạo thương hiệu mới");
        },
        onError: (error: any) => {
            if (error.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                toast.error(firstError[0] || "Dữ liệu không hợp lệ");
            } else {
                toast.error(error.message || "Lỗi khi tạo thương hiệu");
            }
        },
    });
}

export function useUpdateBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            adminService.adminUpdateBrand(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
            toast.success("Đã cập nhật thương hiệu");
        },
        onError: (error: any) => {
            if (error.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                toast.error(firstError[0] || "Dữ liệu không hợp lệ");
            } else {
                toast.error(error.message || "Lỗi khi cập nhật thương hiệu");
            }
        },
    });
}

export function useDeleteBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => adminService.adminDeleteBrand(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
            toast.success("Đã xóa thương hiệu");
        },
        onError: (error: any) => {
            toast.error(error.message || "Lỗi khi xóa thương hiệu");
        },
    });
}
