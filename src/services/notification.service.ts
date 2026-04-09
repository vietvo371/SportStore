import apiClient from "@/lib/api";
import { PaginatedResponse, ApiResponse } from "@/types/api.types";

export interface Notification {
  id: number;
  nguoi_dung_id: number;
  loai: 'trang_thai_don' | 'khuyen_mai' | 'danh_gia_duoc_duyet' | 'he_thong';
  tieu_de: string;
  noi_dung: string;
  du_lieu_them: any;
  da_doc_luc: string | null;
  created_at: string;
}

export const notificationService = {
  // User APIs
  getNotifications: (params?: any) => 
    apiClient.get<any, PaginatedResponse<Notification>>('/notifications', { params }),
  
  markRead: (id: number) => 
    apiClient.put<any, ApiResponse<null>>(`/notifications/${id}/read`),
  
  markAllRead: () => 
    apiClient.put<any, ApiResponse<null>>('/notifications/read-all'),

  // Admin APIs
  broadcast: (data: {
    tieu_de: string;
    noi_dung: string;
    loai: string;
    du_lieu_them?: any;
    gui_email?: boolean;
    che_do?: 'tat_ca' | 'muc_tieu';
    danh_muc_ids?: number[];
  }) => apiClient.post<any, ApiResponse<null>>('/admin/notifications/broadcast', data),

  previewTargetCount: (danhMucIds: number[]) =>
    apiClient.post<any, ApiResponse<{
      tong_muc_tieu: number;
      tong_tat_ca: number;
      tu_mua_hang: number;
      tu_hanh_vi: number;
      tu_yeu_thich: number;
      danh_muc_ids: number[];
      danh_muc_mo_rong: number[];
    }>>('/admin/notifications/preview-target', { danh_muc_ids: danhMucIds }),

  getBroadcastHistory: (params?: any) => 
    apiClient.get<any, PaginatedResponse<Notification>>('/admin/notifications/history', { params }),
};
