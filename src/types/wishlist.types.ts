export interface WishlistItem {
    id: number;
    nguoi_dung_id: number;
    san_pham_id: number;
    created_at: string;
    san_pham: {
        id: number;
        ten_san_pham: string;
        duong_dan: string;
        gia_goc: number;
        gia_khuyen_mai: number | null;
        anh_chinh?: {
            id: number;
            duong_dan_anh: string;
        };
    };
}
