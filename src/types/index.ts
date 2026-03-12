// ============================================================
// API Response Types — match sportstore-be ApiResponse helper
// ============================================================

/**
 * Format chuẩn của mọi response từ sportstore-be
 * Tham chiếu: sportstore-be/app/Http/Helpers/ApiResponse.php
 */
export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

/**
 * Response có phân trang (từ ApiResponse::paginate())
 */
export interface PaginatedResponse<T> {
    success: boolean
    message: string
    data: T[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
        from: number | null
        to: number | null
    }
    links: {
        first: string
        last: string
        prev: string | null
        next: string | null
    }
}

/**
 * Lỗi validation từ BE (422 response)
 */
export interface ValidationErrors {
    [field: string]: string[]
}

// ============================================================
// Auth Types — match BE nguoi_dung table
// ============================================================

export interface User {
    id: number
    ho_va_ten: string
    email: string
    so_dien_thoai: string | null
    anh_dai_dien: string | null
    vai_tro: 'quan_tri' | 'khach_hang'
    trang_thai: boolean
    is_master: boolean
    created_at: string
    updated_at: string
}

export interface LoginRequest {
    email: string
    mat_khau: string
}

export interface RegisterRequest {
    ho_va_ten: string
    email: string
    mat_khau: string
    mat_khau_confirmation: string
    so_dien_thoai?: string
}

export interface AuthResponse {
    user: User
    token: string
}

// ============================================================
// Address Types — match BE dia_chi table
// ============================================================

export interface Address {
    id: number
    ho_va_ten: string
    so_dien_thoai: string
    tinh_thanh: string
    quan_huyen: string
    phuong_xa: string
    dia_chi_cu_the: string
    la_mac_dinh: boolean
}

// ============================================================
// Product Types — match BE san_pham + bien_the_san_pham tables
// ============================================================

export interface Brand {
    id: number
    ten: string
    duong_dan: string
    logo: string | null
}

export interface Category {
    id: number
    ten: string
    duong_dan: string
    hinh_anh: string | null
    danh_muc_cha_id: number | null
    children?: Category[]
}

export interface ProductVariant {
    id: number
    kich_co: string | null
    mau_sac: string | null
    ma_mau_hex: string | null
    hinh_anh: string | null
    gia_rieng: number | null
    ton_kho: number
    trang_thai: boolean
}

export interface ProductImage {
    id: number
    duong_dan_anh: string
    chu_thich: string | null
    la_anh_chinh: boolean
    thu_tu: number
}

export interface Product {
    id: number
    ten_san_pham: string
    duong_dan: string
    ma_sku: string | null
    mo_ta_ngan: string | null
    mo_ta_day_du: string | null
    gia_goc: number
    gia_khuyen_mai: number | null
    so_luong_ton_kho: number
    noi_bat: boolean
    trang_thai: boolean
    da_ban: number
    luot_xem: number
    diem_danh_gia: number
    so_luot_danh_gia: number
    danh_muc: Category
    thuong_hieu: Brand | null
    hinh_anh: ProductImage[]
    bien_the: ProductVariant[]
    anh_chinh?: ProductImage
    created_at: string
}

// ============================================================
// Cart Types — match BE gio_hang + gio_hang_san_pham tables
// ============================================================

export interface CartItem {
    id: number
    san_pham_id: number
    bien_the_id: number | null
    so_luong: number
    don_gia: number
    san_pham: Pick<Product, 'id' | 'ten_san_pham' | 'duong_dan' | 'hinh_anh' | 'anh_chinh'>
    bien_the: Pick<ProductVariant, 'id' | 'kich_co' | 'mau_sac'> | null
}

export interface Cart {
    id: number
    items: CartItem[]
    tong_so_luong: number
    tam_tinh: number
}

// ============================================================
// Order Types — match BE don_hang + chi_tiet_don_hang tables
// ============================================================

export type OrderStatus =
    | 'cho_xac_nhan'
    | 'da_xac_nhan'
    | 'dang_xu_ly'
    | 'dang_giao'
    | 'da_giao'
    | 'da_huy'
    | 'hoan_tra'

export type PaymentMethod = 'cod' | 'chuyen_khoan' | 'vnpay' | 'momo'
export type PaymentStatus = 'chua_thanh_toan' | 'da_thanh_toan' | 'da_hoan_tien'

export interface OrderItem {
    id: number
    san_pham_id: number
    bien_the_id: number | null
    ten_san_pham: string
    thong_tin_bien_the: string | null
    so_luong: number
    don_gia: number
    thanh_tien: number
}

export interface Order {
    id: number
    ma_don_hang: string
    trang_thai: OrderStatus
    phuong_thuc_tt: PaymentMethod
    trang_thai_tt: PaymentStatus
    tam_tinh: number
    so_tien_giam: number
    phi_van_chuyen: number
    tong_tien: number
    ghi_chu: string | null
    ten_nguoi_nhan: string | null
    sdt_nguoi_nhan: string | null
    dia_chi_giao_hang: string | null
    items: OrderItem[]
    created_at: string
}

export interface CheckoutRequest {
    dia_chi_id: number
    phuong_thuc_tt: PaymentMethod
    ma_coupon?: string
    ghi_chu?: string
}

// ============================================================
// Chatbot Types — match BE phien_chatbot + tin_nhan_chatbot tables
// ============================================================

export type ChatRole = 'nguoi_dung' | 'tro_ly'

export interface ChatMessage {
    id: number
    vai_tro: ChatRole
    noi_dung: string
    created_at: string
}

export interface ChatSession {
    ma_phien: string
    messages: ChatMessage[]
}

// ============================================================
// Review Types — match BE danh_gia table
// ============================================================

export interface Review {
    id: number
    nguoi_dung: Pick<User, 'id' | 'ho_va_ten' | 'anh_dai_dien'>
    so_sao: number
    tieu_de: string | null
    noi_dung: string | null
    hinh_anh: string[]
    created_at: string
}

// ============================================================
// Coupon Types
// ============================================================

export interface CouponValidateResponse {
    ma_code: string
    loai_giam: 'phan_tram' | 'so_tien_co_dinh'
    gia_tri: number
    so_tien_giam: number  // Số tiền thực tế được giảm
}

// ============================================================
// Notification Types
// ============================================================

export interface Notification {
    id: number
    loai: string
    tieu_de: string
    noi_dung: string | null
    du_lieu_them: Record<string, unknown> | null
    da_doc_luc: string | null
    created_at: string
}
