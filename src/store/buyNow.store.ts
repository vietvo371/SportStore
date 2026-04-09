import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BuyNowItem {
    san_pham_id: number;
    bien_the_id: number | null;
    so_luong: number;
    don_gia: number;
    san_pham: {
        ten_san_pham: string;
        duong_dan: string;
        anh_chinh?: { duong_dan_anh: string };
    };
    bien_the?: {
        kich_co: string;
        mau_sac: string;
        hinh_anh?: string;
    } | null;
}

interface BuyNowState {
    buyNowItem: BuyNowItem | null;
    setBuyNowItem: (item: BuyNowItem) => void;
    clearBuyNowItem: () => void;
}

export const useBuyNowStore = create<BuyNowState>()(
    persist(
        (set) => ({
            buyNowItem: null,
            setBuyNowItem: (item) => set({ buyNowItem: item }),
            clearBuyNowItem: () => set({ buyNowItem: null }),
        }),
        {
            name: 'buy-now-storage',
        }
    )
);
