export interface ChatMessage {
    id: number;
    phien_id: number;
    vai_tro: 'nguoi_dung' | 'tro_ly';
    noi_dung: string;
    so_token?: number;
    created_at?: string;
}

export interface ChatSession {
    id: number;
    ma_phien: string;
    nguoi_dung_id?: number;
    bat_dau_luc?: string;
    tin_nhan?: ChatMessage[];
}

export interface SendMessagePayload {
    noi_dung: string;
    ma_phien?: string;
}

export interface ChatResponse {
    ma_phien: string;
    reply: string;
}
