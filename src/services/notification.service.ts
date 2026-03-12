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
  broadcast: (data: { tieu_de: string; noi_dung: string; loai: string; du_lieu_them?: any }) => 
    apiClient.post<any, ApiResponse<null>>('/admin/notifications/broadcast', data),
  
  getBroadcastHistory: (params?: any) => 
    apiClient.get<any, PaginatedResponse<Notification>>('/admin/notifications/history', { params }),
};
