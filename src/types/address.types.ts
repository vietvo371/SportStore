export interface Address {
    id: number;
    nguoi_dung_id: number;
    ho_va_ten: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_cu_the: string;
    la_mac_dinh: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AddressPayload {
    ho_va_ten: string;
    so_dien_thoai: string;
    tinh_thanh: string;
    quan_huyen: string;
    phuong_xa: string;
    dia_chi_cu_the: string;
    la_mac_dinh?: boolean;
}
