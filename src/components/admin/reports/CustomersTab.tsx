'use client';

import { useAdminReportsCustomerStats, useAdminReportsTopCustomers, useAdminReportsCustomerChart, ReportFilters } from "@/hooks/useAdminReports";
import { formatCurrency } from "@/lib/utils";
import { Activity, Users, ShoppingCart, UserPlus, Heart, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

interface CustomersTabProps {
    filters: ReportFilters;
}

export function CustomersTab({ filters }: CustomersTabProps) {
    const { data: stats, isLoading: isLoadingStats } = useAdminReportsCustomerStats(filters);
    const { data: topCustomers, isLoading: isLoadingTop } = useAdminReportsTopCustomers(filters, 10);
    const { data: chartData, isLoading: isLoadingChart } = useAdminReportsCustomerChart(filters);

    if (isLoadingStats || isLoadingTop || isLoadingChart) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <p className="text-sm">Đang tải dữ liệu khách hàng...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Không thể tải dữ liệu khách hàng</p>
            </div>
        );
    }

    // Format chart data for nice axes
    const formattedChartData = chartData?.map(item => ({
        ...item,
        formattedDate: item.date.length === 7 ? format(parseISO(item.date + "-01"), "MM/yyyy") : format(parseISO(item.date), "dd/MM")
    })) || [];

    return (
        <div className="space-y-6">
            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Tổng tài khoản</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Khách thuê bao mới</p>
                        <p className="text-2xl font-bold text-slate-900">+{stats.new_period.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Tỷ lệ chuyển đổi</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.conversion_rate}%</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <Heart className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Khách hàng mua lại</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.returning.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 overflow-hidden mt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-900">Tăng Trưởng Khách Hàng Mới</h2>
                </div>
                
                <div className="h-64 sm:h-80 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={formattedChartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="formattedDate" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="new_users" 
                                name="Khách hàng mới"
                                stroke="#4f46e5" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorUsers)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List Table Placeholder */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mt-6">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    <h2 className="text-lg font-bold text-slate-900">Xếp hạng Khách hàng VIP</h2>
                </div>
                
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12">#</th>
                                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                                <th className="px-6 py-4 font-semibold text-right">Tổng đơn</th>
                                <th className="px-6 py-4 font-semibold text-right">Tích luỹ chi tiêu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topCustomers && topCustomers.length > 0 ? topCustomers.map((user: any, index: number) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-200">
                                                {user.anh_dai_dien ? (
                                                    <img src={user.anh_dai_dien} alt={user.ho_ten} className="h-full w-full object-cover" />
                                                ) : (
                                                    user.ho_ten.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.ho_ten}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-100">
                                            {user.total_orders} đơn
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                        {formatCurrency(user.total_spent)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        Chưa có dữ liệu khách hàng.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
