import apiClient from '@/lib/api';
import { ApiResponse } from '@/types/api.types';

export interface Banner {
    id: number;
    tieu_de: string;
    mo_ta: string | null;
    hinh_anh: string;
    duong_dan: string | null;
    vi_tri: string;
    thu_tu: number;
    trang_thai: boolean;
}

export const bannerService = {
    getBanners: async (viTri: string = 'home_main'): Promise<Banner[]> => {
        // BE may not have a specific Banner API fully mapped out yet, but assuming standard convention:
        try {
            const response: ApiResponse<Banner[]> = await apiClient.get('/banners', {
                params: { vi_tri: viTri, trang_thai: 1 },
            });
            return response.data; // Note: intercepted response is already unwrapped from axios `.data`
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            return [];
        }
    },
};
