'use client';

import { useAdminReportsTopProducts, useAdminReportsProductStats, ReportFilters } from "@/hooks/useAdminReports";
import { formatCurrency } from "@/lib/utils";
import { Crown, Package, Loader2, Activity, Eye, AlertTriangle, MessageSquare } from "lucide-react";

interface ProductsTabProps {
    filters: ReportFilters;
}

export function ProductsTab({ filters }: ProductsTabProps) {
    const { data: stats, isLoading: isLoadingStats } = useAdminReportsProductStats(filters);
    const { data: topProducts, isLoading: isLoadingTop, isError } = useAdminReportsTopProducts(filters, 10);

    if (isLoadingStats || isLoadingTop) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <p className="text-sm">Đang tải biểu đồ sản phẩm...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Không thể tải dữ liệu sản phẩm</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Quick Stats Summary */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Sản phẩm Active</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total_active}</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                            <Eye className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Lượt xem trang SP</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total_views.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Lượt đánh giá mới</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.period_reviews}</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-rose-100/50 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-rose-500">Cảnh báo Tồn kho</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.low_stock} <span className="text-base text-slate-400 font-normal">biến thể</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Products Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-slate-900">Top 10 Sản Phẩm Bán Chạy (All Time)</h2>
                </div>
                
                <div className="overflow-x-auto relative">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12">#</th>
                                <th className="px-6 py-4 font-semibold">Tên sản phẩm</th>
                                <th className="px-6 py-4 font-semibold text-right">Giá bán</th>
                                <th className="px-6 py-4 font-semibold text-right">Lượt mua</th>
                                <th className="px-6 py-4 font-semibold text-right">Doanh thu mang lại</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topProducts && topProducts.length > 0 ? topProducts.map((product: any, index: number) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.ten_san_pham} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 line-clamp-1">{product.ten_san_pham}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Mã SP: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        {product.gia_khuyen_mai ? (
                                            <div>
                                                <span className="text-rose-600 font-semibold">{formatCurrency(product.gia_khuyen_mai)}</span>
                                                <span className="text-xs text-slate-400 line-through ml-2">{formatCurrency(product.gia_goc)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-900 font-semibold">{formatCurrency(product.gia_goc)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100">
                                            {product.total_sold}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                        {formatCurrency(product.total_revenue)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        Chưa có dữ liệu thống kê sản phẩm bán chạy.
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
