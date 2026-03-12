import apiClient from '@/lib/api';
import { Brand } from '@/types/brand.types';
import { useQuery } from '@tanstack/react-query';

export const brandService = {
    getBrands: async (): Promise<Brand[]> => {
        try {
            const response: any = await apiClient.get('/brands');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch brands:', error);
            return [];
        }
    },
};

export const brandKeys = {
    all: ['brands'] as const,
};

export const useBrands = () => {
    return useQuery({
        queryKey: brandKeys.all,
        queryFn: () => brandService.getBrands(),
        staleTime: 1000 * 60 * 5, // Cache 5 minutes
    });
};
