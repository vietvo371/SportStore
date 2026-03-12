export interface CartItem {
    id: number;
    gio_hang_id: number;
    san_pham_id: number;
    bien_the_id: number | null;
    so_luong: number;
    don_gia: number;
    // Relationships mapping
    san_pham?: any; // Will use Product type from product.types.ts
    bien_the?: any;
}

export interface Cart {
    id: number;
    nguoi_dung_id: number;
    tam_tinh: number;
    tong_so_luong: number;
    items?: CartItem[];
}

export interface AddToCartPayload {
    san_pham_id: number;
    so_luong?: number;
    bien_the_id?: number;
}

export interface UpdateCartItemPayload {
    so_luong: number;
}
