export interface OrderPayload {
    dia_chi_id: number;
    phuong_thuc_tt: 'cod' | 'chuyen_khoan' | 'vnpay' | 'momo';
    ma_coupon?: string;
    ghi_chu?: string;
}

export interface OrderItem {
    id: number;
    don_hang_id: number;
    san_pham_id: number;
    bien_the_id: number | null;
    ten_san_pham: string;
    thong_tin_bien_the: string | null;
    so_luong: number;
    don_gia: number;
    thanh_tien: number;
    san_pham?: {
        anh_chinh?: {
            duong_dan_anh: string;
        }
        duong_dan: string;
    };
}

export interface Order {
    id: number;
    nguoi_dung_id: number;
    ma_don_hang: string;
    ten_nguoi_nhan: string;
    sdt_nguoi_nhan: string;
    dia_chi_giao_hang: string;
    ghi_chu: string | null;
    tam_tinh: number;
    phi_van_chuyen: number;
    so_tien_giam: number;
    tong_tien: number;
    phuong_thuc_tt: string;
    trang_thai_tt: string;
    trang_thai: string;
    created_at: string;
    items?: OrderItem[];
    danh_gia?: any[];
}
