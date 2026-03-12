import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';

export const categoryKeys = {
    all: ['categories'] as const,
    detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
};

export const useCategories = () => {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: () => categoryService.getCategories(),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};

export const useCategory = (slug: string) => {
    return useQuery({
        queryKey: categoryKeys.detail(slug),
        queryFn: () => categoryService.getCategoryBySlug(slug),
        enabled: !!slug,
    });
};
