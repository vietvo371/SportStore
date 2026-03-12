export interface Permission {
    id: number;
    ten: string;
    ma_slug: string;
    nhom: string;
}

export interface Role {
    id: number;
    ten: string;
    ma_slug: string;
    quyen?: Permission[];
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    email: string;
    ho_va_ten: string;
    so_dien_thoai: string | null;
    vai_tro: string; // Giữ lại cho backward compatibility
    anh_dai_dien: string | null;
    trang_thai: boolean;
    is_master: boolean;
    xac_thuc_email_luc: string | null;
    cac_vai_tro?: Role[]; // Quan hệ vai trò thực tế
}

export interface AuthResponse {
    user: User;
    token: string;
}
