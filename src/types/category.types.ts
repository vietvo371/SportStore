export interface Category {
    id: number;
    ten: string;
    duong_dan: string;
    danh_muc_cha_id: number | null;
    hinh_anh: string | null;
    mo_ta: string | null;
    thu_tu: number;
    trang_thai: boolean;
    danh_muc_con?: Category[];
}
