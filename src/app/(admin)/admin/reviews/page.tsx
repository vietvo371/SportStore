'use client';

import { useState } from "react";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { ReviewTable } from "@/components/admin/ReviewTable";
import { AccessDenied } from "@/components/admin/AccessDenied";
import {
    Star,
    Filter,
    Search,
    MessageSquare,
    CheckCircle2,
    Clock,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export default function ReviewModerationPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>("all");
    const [search, setSearch] = useState("");

    const { data: response, isLoading, error } = useAdminReviews({
        page,
        da_duyet: status === "all" ? undefined : status === "approved",
        search: search || undefined
    });

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Duyệt Đánh Giá" />;
    }

    const reviews = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl shadow-sm border border-primary/5">
                            <Star className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Duyệt Đánh Giá</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                <MessageSquare className="h-4 w-4" />
                                Quản lý và kiểm duyệt phản hồi từ khách hàng
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-black">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang chờ</span>
                            <span className="text-xl font-black text-slate-900 leading-tight">...</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-auto shrink-0 px-2">
                    <Tabs value={status} onValueChange={setStatus} className="w-full">
                        <TabsList className="bg-slate-50 p-1 rounded-2xl h-11 border border-slate-100">
                            <TabsTrigger value="all" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wide">
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wide gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                Chờ duyệt
                            </TabsTrigger>
                            <TabsTrigger value="approved" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wide gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Đã duyệt
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Tìm kiếm theo tên sản phẩm, khách hàng hoặc nội dung..."
                        className="pl-11 h-12 bg-slate-50 border-slate-100 rounded-2xl font-medium focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 font-bold hover:bg-slate-50 gap-2 shrink-0">
                    <Filter className="h-4 w-4" />
                    Lọc nâng cao
                </Button>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tải danh sách đánh giá...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <ReviewTable reviews={reviews} />

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
                                Trang {meta.current_page} / {meta.last_page} • {meta.total} đánh giá
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 rounded-xl px-4 border-slate-100 font-bold disabled:opacity-30"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 rounded-xl px-4 border-slate-100 font-bold disabled:opacity-30"
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
        </div>
    );
}
