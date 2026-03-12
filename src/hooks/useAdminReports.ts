import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export interface PaymentSourceData {
    phuong_thuc_tt: 'cod' | 'chuyen_khoan' | 'vnpay' | 'momo';
    usage_count: number;
    total_amount: string;
}

export interface OverviewData {
    revenue: { value: number; growth: number };
    orders: { value: number; growth: number };
    customers: { value: number; growth: number };
    products_sold: { value: number; growth: number };
    payment_sources: PaymentSourceData[];
}

export interface ChartData {
    date: string;
    revenue: number;
}

export interface TopProductData {
    id: number;
    ten_san_pham: string;
    gia_goc: string;
    gia_khuyen_mai: string | null;
    image: string | null;
    total_sold: string;
    total_revenue: string;
}

export type ReportPeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface ReportFilters {
    period: ReportPeriod;
    from?: Date;
    to?: Date;
}

const buildQueryParams = (filters: ReportFilters, extra?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters.period !== 'custom') {
        params.append('period', filters.period);
    }
    if (filters.from && filters.to) {
        // Backend expects YYYY-MM-DD
        params.append('from', filters.from.toISOString().split('T')[0]);
        params.append('to', filters.to.toISOString().split('T')[0]);
    }
    if (extra) {
        Object.entries(extra).forEach(([k, v]) => params.append(k, String(v)));
    }
    return params.toString();
};

export function useAdminReportsOverview(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-overview', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: OverviewData }>(`/admin/reports/overview?${query}`);
            if (!response.success) throw new Error("Failed to fetch overview");
            return response.data;
        },
    });
}

export function useAdminReportsChart(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-chart', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: ChartData[] }>(`/admin/reports/revenue-chart?${query}`);
            if (!response.success) throw new Error("Failed to fetch chart data");
            return response.data;
        },
    });
}

export function useAdminReportsTopProducts(filters: ReportFilters, limit: number = 10) {
    return useQuery({
        queryKey: ['admin-reports-top-products', filters, limit],
        queryFn: async () => {
            const query = buildQueryParams(filters, { limit });
            const response = await apiClient.get<any, { success: boolean; data: TopProductData[] }>(`/admin/reports/top-products?${query}`);
            if (!response.success) throw new Error("Failed to fetch top products");
            return response.data;
        },
    });
}

// ==========================================
// 2. PRODUCTS TAB
// ==========================================
export interface ProductStatsData {
    total_active: number;
    total_views: number;
    low_stock: number;
    period_reviews: number;
}

export function useAdminReportsProductStats(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-product-stats', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: ProductStatsData }>(`/admin/reports/product-stats?${query}`);
            if (!response.success) throw new Error("Failed to fetch product stats");
            return response.data;
        },
    });
}

// ==========================================
// 3. CUSTOMERS TAB
// ==========================================
export interface CustomerStatsData {
    total: number;
    new_period: number;
    conversion_rate: number;
    returning: number;
}

export interface CustomerChartData {
    date: string;
    new_users: number;
}

export interface TopCustomerData {
    id: number;
    ho_ten: string;
    email: string;
    anh_dai_dien: string | null;
    total_orders: number;
    total_spent: string;
}

export function useAdminReportsCustomerStats(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-customer-stats', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: CustomerStatsData }>(`/admin/reports/customer-stats?${query}`);
            if (!response.success) throw new Error("Failed to fetch customer stats");
            return response.data;
        },
    });
}

export function useAdminReportsCustomerChart(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-customer-chart', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: CustomerChartData[] }>(`/admin/reports/customer-chart?${query}`);
            if (!response.success) throw new Error("Failed to fetch customer chart data");
            return response.data;
        },
    });
}

export function useAdminReportsTopCustomers(filters: ReportFilters, limit: number = 10) {
    return useQuery({
        queryKey: ['admin-reports-top-customers', filters, limit],
        queryFn: async () => {
            const query = buildQueryParams(filters, { limit });
            const response = await apiClient.get<any, { success: boolean; data: TopCustomerData[] }>(`/admin/reports/top-customers?${query}`);
            if (!response.success) throw new Error("Failed to fetch top customers");
            return response.data;
        },
    });
}


// ==========================================
// 4. MARKETING TAB
// ==========================================
export interface MarketingStatsData {
    active_coupons: number;
    coupon_uses: number;
    total_sponsored: number;
    avg_rating: number;
}

export interface CouponChartData {
    name: string;
    value: number;
}

export interface TopCouponData {
    id: number;
    ma_code: string;
    usage_count: number;
    total_discount: string;
    total_revenue: string;
}

export function useAdminReportsMarketingStats(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-marketing-stats', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: MarketingStatsData }>(`/admin/reports/marketing-stats?${query}`);
            if (!response.success) throw new Error("Failed to fetch marketing stats");
            return response.data;
        },
    });
}

export function useAdminReportsCouponChart(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-coupon-chart', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: CouponChartData[] }>(`/admin/reports/coupon-chart?${query}`);
            if (!response.success) throw new Error("Failed to fetch coupon chart");
            return response.data;
        },
    });
}

export function useAdminReportsTopCoupons(filters: ReportFilters, limit: number = 5) {
    return useQuery({
        queryKey: ['admin-reports-top-coupons', filters, limit],
        queryFn: async () => {
            const query = buildQueryParams(filters, { limit });
            const response = await apiClient.get<any, { success: boolean; data: TopCouponData[] }>(`/admin/reports/top-coupons?${query}`);
            if (!response.success) throw new Error("Failed to fetch top coupons");
            return response.data;
        },
    });
}


// ==========================================
// 5. CHATBOT TAB
// ==========================================
export interface ChatbotStatsData {
    total_sessions: number;
    avg_messages: number;
    total_tokens: number;
    estimated_cost_usd: number;
}

export interface ChatbotChartData {
    date: string;
    sessions: number;
    tokens: number;
}

export interface RecentChatData {
    id: number;
    user_name: string | null;
    created_at: string;
    message_count: number;
    total_tokens: number;
}

export function useAdminReportsChatbotStats(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-chatbot-stats', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: ChatbotStatsData }>(`/admin/reports/chatbot-stats?${query}`);
            if (!response.success) throw new Error("Failed to fetch chatbot stats");
            return response.data;
        },
    });
}

export function useAdminReportsChatbotChart(filters: ReportFilters) {
    return useQuery({
        queryKey: ['admin-reports-chatbot-chart', filters],
        queryFn: async () => {
            const query = buildQueryParams(filters);
            const response = await apiClient.get<any, { success: boolean; data: ChatbotChartData[] }>(`/admin/reports/chatbot-chart?${query}`);
            if (!response.success) throw new Error("Failed to fetch chatbot chart");
            return response.data;
        },
    });
}

export function useAdminReportsRecentChats(filters: ReportFilters, limit: number = 10) {
    return useQuery({
        queryKey: ['admin-reports-recent-chats', filters, limit],
        queryFn: async () => {
            const query = buildQueryParams(filters, { limit });
            const response = await apiClient.get<any, { success: boolean; data: RecentChatData[] }>(`/admin/reports/recent-chats?${query}`);
            if (!response.success) throw new Error("Failed to fetch recent chats");
            return response.data;
        },
    });
}

