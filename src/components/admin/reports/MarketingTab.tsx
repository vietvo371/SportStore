'use client';

import { useAdminReportsMarketingStats, useAdminReportsCouponChart, useAdminReportsTopCoupons, ReportFilters } from "@/hooks/useAdminReports";
import { formatCurrency } from "@/lib/utils";
import { Activity, Ticket, Star, DollarSign, Target, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MarketingTabProps {
    filters: ReportFilters;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#ec4899'];

export function MarketingTab({ filters }: MarketingTabProps) {
    const { data: stats, isLoading: isLoadingStats } = useAdminReportsMarketingStats(filters);
    const { data: topCoupons, isLoading: isLoadingTop } = useAdminReportsTopCoupons(filters, 5);
    const { data: chartData, isLoading: isLoadingChart } = useAdminReportsCouponChart(filters);

    if (isLoadingStats || isLoadingTop || isLoadingChart) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <p className="text-sm">Đang tải dữ liệu marketing...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Không thể tải dữ liệu marketing</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                        <Ticket className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Mã giảm giá Active</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.active_coupons}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Lượt sử dụng mã</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.coupon_uses.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Chi phí tài trợ</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total_sponsored)}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <Star className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Điểm đánh giá TB</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.avg_rating} <span className="text-base text-slate-400 font-normal">/ 5.0</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Donut Chart: Coupon usage ratio */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 lg:col-span-1 border-b-0 lg:border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="h-5 w-5 text-orange-500" />
                        <h2 className="text-lg font-bold text-slate-900">Tỷ trọng Mã Giảm Giá</h2>
                    </div>
                    
                    <div className="h-[250px] w-full">
                        {chartData && chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number) => [`${value} lượt dùng`]}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Chưa có dữ liệu sử dụng mã.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Coupons Table */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-slate-900">Hiệu quả phân bổ Mã Giảm Giá</h2>
                    </div>
                    
                    <div className="overflow-x-auto relative min-h-[250px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Mã code</th>
                                    <th className="px-6 py-4 font-semibold text-center">Lượt dùng</th>
                                    <th className="px-6 py-4 font-semibold text-right">Tổng chiết khấu</th>
                                    <th className="px-6 py-4 font-semibold text-right">Doanh thu kéo lại</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topCoupons && topCoupons.length > 0 ? topCoupons.map((coupon: any) => (
                                    <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200 uppercase tracking-widest text-xs">
                                                {coupon.ma_code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">
                                            {coupon.usage_count}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-rose-600 font-semibold">
                                                -{formatCurrency(coupon.total_discount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                                            {formatCurrency(coupon.total_revenue)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                            Chưa có dữ liệu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
