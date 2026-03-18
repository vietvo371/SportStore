export interface Category {
    id: number;
    danh_muc_cha_id: number | null;
    ten: string;
    duong_dan: string;
    hinh_anh: string | null;
    mo_ta: string | null;
    thu_tu: number;
    trang_thai: boolean;
    danh_muc_con?: Category[];
}

export interface Brand {
    id: number;
    ten: string;
    duong_dan: string;
    logo: string | null;
    mo_ta: string | null;
}

export interface ProductVariant {
    id: number;
    san_pham_id: number;
    ma_sku: string | null;
    kich_co: string | null;
    mau_sac: string | null;
    ma_mau_hex: string | null;
    hinh_anh: string | null;
    gia_rieng: number | null;
    ton_kho: number;
    trang_thai: boolean;
}

export interface ProductImage {
    id: number;
    san_pham_id: number;
    duong_dan_anh: string;
    url?: string;
    chu_thich: string | null;
    thu_tu: number;
    la_anh_chinh: boolean;
}

export interface Product {
    id: number;
    danh_muc_id: number;
    thuong_hieu_id: number;
    ten_san_pham: string;
    duong_dan: string;
    ma_sku: string | null;
    mo_ta_ngan: string | null;
    mo_ta_day_du: string | null;
    gia_goc: number;
    gia_khuyen_mai: number | null;
    so_luong_ton_kho: number;
    noi_bat: boolean;
    trang_thai: boolean;
    da_ban: number;
    luot_xem: number;
    diem_danh_gia: string;
    so_luot_danh_gia: number;
    can_review?: boolean;
    has_reviewed?: boolean;
    eligible_order_id?: number | null;
    created_at?: string;
    updated_at?: string;

    // Relationships
    danh_muc?: Category;
    thuong_hieu?: Brand;
    bien_the?: ProductVariant[];
    hinh_anh?: ProductImage[];
    hinh_anh_san_pham?: ProductImage[];
    danh_gia?: Review[];
    anh_chinh?: ProductImage;
}

export interface Review {
    id: number;
    san_pham_id: number;
    nguoi_dung_id: number;
    don_hang_id: number | null;
    so_sao: number;
    tieu_de: string | null;
    noi_dung: string | null;
    da_duyet: boolean;
    created_at: string;
    nguoi_dung?: {
        id: number;
        ho_va_ten: string;
        anh_dai_dien: string | null;
    };
}
