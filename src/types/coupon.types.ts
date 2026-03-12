export interface CouponPayload {
    ma_code: string;
    tam_tinh: number;
}

export interface CouponResponse {
    ma_code: string;
    loai_giam: 'phan_tram' | 'so_tien_co_dinh';
    gia_tri: number;
    so_tien_giam: number;
}
