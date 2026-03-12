'use client';

import { useAdminReportsOverview } from "@/hooks/useAdminReports";
import { formatCurrency } from "@/lib/utils";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    Activity,
    CreditCard
} from "lucide-react";
import { ReportFilters } from "@/hooks/useAdminReports";

interface RevenueTabProps {
    filters: ReportFilters;
}

export function RevenueTab({ filters }: RevenueTabProps) {
    const { data: overview, isLoading, isError } = useAdminReportsOverview(filters);

    if (isLoading) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-400">
                <p className="text-sm">Đang tải dữ liệu doanh thu...</p>
            </div>
        );
    }

    if (isError || !overview) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Không thể tải dữ liệu doanh thu</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Tổng doanh thu</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(overview.revenue.value)}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Tổng đơn hàng</p>
                        <p className="text-2xl font-bold text-slate-900">{overview.orders.value.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Sản phẩm đã bán</p>
                        <p className="text-2xl font-bold text-slate-900">{overview.products_sold.value.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500 shrink-0">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Khách hàng mới</p>
                        <p className="text-2xl font-bold text-slate-900">{overview.customers.value.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Source (Taking 1/3 of space or full width if preferred) */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-3 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-bold text-slate-900">Nguồn thanh toán</h2>
                    </div>
                    
                    <div className="p-5 space-y-4">
                        {overview.payment_sources && overview.payment_sources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {overview.payment_sources.map((src, idx) => {
                                    const labels: Record<string, { name: string, color: string }> = {
                                        'cod': { name: 'Giao hàng (COD)', color: 'bg-emerald-500 text-emerald-700' },
                                        'vnpay': { name: 'Cổng VNPAY', color: 'bg-blue-500 text-blue-700' },
                                        'momo': { name: 'Ví MoMo', color: 'bg-rose-500 text-rose-700' },
                                        'chuyen_khoan': { name: 'Chuyển khoản', color: 'bg-indigo-500 text-indigo-700' },
                                    };
                                    const label = labels[src.phuong_thuc_tt] || { name: src.phuong_thuc_tt, color: 'bg-slate-500 text-slate-700' };
                                    const totalSystemRevenue = overview.revenue.value || 1; 
                                    const percentage = Math.round((parseFloat(src.total_amount) / totalSystemRevenue) * 100);

                                    return (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className={`font-semibold text-sm ${label.color.split(' ')[1]}`}>{label.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{src.usage_count} giao dịch</p>
                                                </div>
                                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-white border border-slate-100 shadow-sm">
                                                    {percentage}%
                                                </span>
                                            </div>
                                            <p className="font-bold text-slate-900 mt-2">{formatCurrency(parseFloat(src.total_amount))}</p>
                                            <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full ${label.color.split(' ')[0]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                           <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
                               Không có dữ liệu giao dịch.
                           </div> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
