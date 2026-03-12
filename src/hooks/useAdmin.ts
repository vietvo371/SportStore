import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export const adminKeys = {
    all: ['admin'] as const,
    dashboard: () => [...adminKeys.all, 'dashboard'] as const,
};

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: adminKeys.dashboard(),
        queryFn: () => adminService.getDashboardStats(),
    });
};

export const useAdminProducts = (params: any = { page: 1 }) => {
    return useQuery({
        queryKey: [...adminKeys.all, 'products', params],
        queryFn: () => adminService.getProducts(params),
    });
};

export const useAdminProduct = (id: number) => {
    return useQuery({
        queryKey: [...adminKeys.all, 'products', id],
        queryFn: () => adminService.getProduct(id),
        enabled: !!id,
    });
};

export const useAdminMetadata = () => {
    const categoriesQuery = useQuery({
        queryKey: [...adminKeys.all, 'categories'],
        queryFn: () => adminService.getAllCategories(),
    });

    const brandsQuery = useQuery({
        queryKey: [...adminKeys.all, 'brands'],
        queryFn: () => adminService.getAllBrands(),
    });

    return {
        categories: categoriesQuery.data?.data || [],
        brands: brandsQuery.data?.data || [],
        isLoading: categoriesQuery.isLoading || brandsQuery.isLoading,
    };
};
