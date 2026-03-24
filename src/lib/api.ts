import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Interceptor for Request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Đọc token từ Zustand persist store (nguồn chính) hoặc fallback sang Cookie
    let token: string | null = null;
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.state?.token ?? null;
      }
    } catch {}
    // Fallback: đọc từ Cookie (dùng khi SSR hoặc localStorage không khả dụng)
    if (!token) {
      token = Cookies.get('token') ?? null;
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for Response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap the generic API Response so we don't have to keep doing res.data.data
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
        window.location.href = '/login';
      }
    }

    // Format error to match ApiResponse structure
    const formattedError = error.response?.data || {
      success: false,
      message: error.message || 'Có lỗi xảy ra',
    };

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Chỉ toast cho hành động (POST, PUT, DELETE, PATCH)
      // GET 403 được xử lý bởi <AccessDenied /> component trong mỗi page — tránh spam toast
      if (error.config?.method?.toLowerCase() !== 'get') {
        toast.error(formattedError.message || 'Bạn không có quyền thực hiện hành động này');
      }
    }

    // Add status code for easier handling in components
    if (error.response) {
      formattedError.status = error.response.status;
    }

    return Promise.reject(formattedError);
  }
);

export default apiClient;
