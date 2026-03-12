'use client';

import { useState } from "react";
import { useAdminCoupons } from "@/hooks/useAdminCoupons";
import { CouponTable } from "@/components/admin/CouponTable";
import { CouponDialog } from "@/components/admin/CouponDialog";
import { AccessDenied } from "@/components/admin/AccessDenied";
import {
    Ticket,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Activity,
    Calendar,
    Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CouponManagementPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

    const { data: response, isLoading, error } = useAdminCoupons({
        page,
        search: search || undefined
    });

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Mã giảm giá" />;
    }

    const coupons = response?.data || [];
    const meta = response?.meta;

    const handleAddClick = () => {
        setSelectedCoupon(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (coupon: any) => {
        setSelectedCoupon(coupon);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Mã giảm giá</h1>
                    <p className="text-slate-500 text-sm italic">Quản lý hệ thống mã giảm giá và khuyến mãi.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAddClick}
                        className="shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo mã mới
                    </Button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Đang hoạt động</p>
                        <p className="text-2xl font-bold text-slate-900">{meta?.total || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Đa sử dụng</p>
                        <p className="text-2xl font-bold text-slate-900">... lượt</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Chiến dịch tháng</p>
                        <p className="text-2xl font-bold text-slate-900">... mã</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm mã theo mã code hoặc mô tả..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
                        />
                    </div>
                    <Button variant="outline" className="text-slate-600">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Đang tải danh sách ưu đãi...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <CouponTable coupons={coupons} onEdit={handleEditClick} />

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-sm text-slate-500 ml-2">
                                Trang {meta.current_page} / {meta.last_page} • Tổng {meta.total} mã
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={page === meta.last_page}
                                >
                                    Sau <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CouponDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                coupon={selectedCoupon}
            />
        </div>
    );
}
