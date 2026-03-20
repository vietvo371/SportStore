import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { toast } from "sonner";
import Cookies from "js-cookie";

export const notificationKeys = {
  all: ['notifications'] as const,
  user: (params?: any) => [...notificationKeys.all, 'user', params] as const,
  admin: (params?: any) => [...notificationKeys.all, 'admin', params] as const,
};

// --- User Hooks ---

export const useNotifications = (params?: any) => {
  return useQuery({
    queryKey: notificationKeys.user(params),
    queryFn: () => notificationService.getNotifications(params),
    enabled: !!Cookies.get('token'),
  });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Đã đánh dấu tất cả là đã đọc");
    },
  });
};

// --- Admin Hooks ---

export const useBroadcastNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tieu_de: string; noi_dung: string; loai: string; du_lieu_them?: any; gui_email?: boolean }) => 
      notificationService.broadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'admin'] });
      toast.success("Đã gửi thông báo quảng bá thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi gửi thông báo");
    }
  });
};

export const useBroadcastHistory = (params?: any) => {
  return useQuery({
    queryKey: notificationKeys.admin(params),
    queryFn: () => notificationService.getBroadcastHistory(params),
  });
};
