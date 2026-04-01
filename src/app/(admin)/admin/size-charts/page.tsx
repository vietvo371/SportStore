'use client';

import { useState } from "react";
import { useAdminSizeCharts } from "@/hooks/useAdminSizeCharts";
import { BangSizeTable } from "@/components/admin/BangSizeTable";
import { BangSizeDialog } from "@/components/admin/BangSizeDialog";
import { AccessDenied } from "@/components/admin/AccessDenied";
import {
    Ruler,
    Plus,
    Search,
    Filter,
    Loader2,
    Info,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SizeChartManagementPage() {
    const [search, setSearch] = useState("");
    const [loai, setLoai] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const { data: response, isLoading, error } = useAdminSizeCharts({
        search: search || undefined,
        loai: loai === "all" ? undefined : loai
    });

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Bảng Size" />;
    }

    const items = response?.data || [];

    const handleAddClick = () => {
        setSelectedItem(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (item: any) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header section with Glassmorphism effect */}
            <div className="relative p-10 rounded-[32px] bg-slate-900 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-30"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary backdrop-blur-md border border-primary/20 ring-4 ring-primary/5">
                                <Ruler className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Quản lý Bảng Size</h1>
                        </div>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            Thiết lập quy tắc tư vấn size tự động cho Chatbot AI.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                         <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hidden sm:flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chatbot Ready</span>
                         </div>
                        <Button
                            onClick={handleAddClick}
                            className="rounded-2xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none"
                        >
                            <Plus className="h-5 w-5 mr-2 stroke-[3]" />
                            THÊM QUY TẮC MỚI
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                        <Info className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900">Cách hoạt động</p>
                        <p className="text-sm text-slate-500">Bot sẽ tự động trích xuất Chiều cao, Cân nặng hoặc Dài chân từ tin nhắn của khách để đối chiếu với bảng size này.</p>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900">Tính năng ưu tiên</p>
                        <p className="text-sm text-slate-500">Nếu bạn gán Thương hiệu cho quy tắc, Bot sẽ ưu tiên tư vấn theo bảng size của hãng đó trước khi dùng bảng size chung.</p>
                    </div>
                </div>
            </div>

            {/* Filter & Table section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm theo tên size..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus-visible:ring-primary/20 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                         <Select value={loai} onValueChange={setLoai}>
                            <SelectTrigger className="h-12 w-[180px] rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-primary/20">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Tất cả loại" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
                                <SelectItem value="all" className="rounded-xl">Tất cả loại</SelectItem>
                                <SelectItem value="ao" className="rounded-xl">Áo</SelectItem>
                                <SelectItem value="quan" className="rounded-xl">Quần</SelectItem>
                                <SelectItem value="giay" className="rounded-xl">Giày</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400 bg-white/50 rounded-[40px] border border-dashed border-slate-200 backdrop-blur-sm">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                            <div className="relative h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        </div>
                        <p className="text-sm font-bold tracking-widest uppercase">Đang đồng bộ dữ liệu...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <BangSizeTable items={items} onEdit={handleEditClick} />
                    </div>
                )}
            </div>

            <BangSizeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                sizeChart={selectedItem}
            />
        </div>
    );
}
