"use client";

import { useState } from "react";
import { 
    Megaphone, 
    History, 
    Search, 
    Bell, 
    User, 
    Calendar,
    Tag,
    Info,
    RefreshCw,
    Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useBroadcastHistory } from "@/hooks/useNotifications";
import { BroadcastDialog } from "@/components/admin/notifications/BroadcastDialog";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function NotificationAdminPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    
    const { data: response, isLoading, error, refetch } = useBroadcastHistory({ page, search });

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Thông báo" />;
    }

    const notifications = response?.data || [];
    const meta = response?.meta;

    const getIcon = (loai: string) => {
        switch (loai) {
            case 'khuyen_mai': return <Tag className="h-4 w-4 text-rose-500" />;
            case 'he_thong': return <Info className="h-4 w-4 text-blue-500" />;
            default: return <Bell className="h-4 w-4 text-slate-500" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="h-6 w-6 text-indigo-600" />
                        Quản lý Thông báo
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gửi thông báo quảng bá cho toàn bộ khách hàng và theo dõi lịch sử gửi.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsBroadcastOpen(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200"
                >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Gửi quảng bá mới
                </Button>
            </div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <History className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng đã gửi</p>
                        <p className="text-2xl font-black text-slate-900">{meta?.total || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khuyến mãi</p>
                        <p className="text-2xl font-black text-slate-900">
                            {notifications.filter(n => n.loai === 'khuyen_mai').length}+
                        </p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Info className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hệ thống</p>
                        <p className="text-2xl font-black text-slate-900">
                            {notifications.filter(n => n.loai === 'he_thong').length}+
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Tìm kiếm nội dung thông báo..." 
                            className="pl-10 h-10 bg-slate-50 border-slate-100 focus-visible:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="h-10 px-4 gap-2 text-slate-600">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="w-[120px] font-bold text-slate-700">Người nhận</TableHead>
                                <TableHead className="font-bold text-slate-700">Loại & Tiêu đề</TableHead>
                                <TableHead className="font-bold text-slate-700">Nội dung</TableHead>
                                <TableHead className="w-[150px] font-bold text-slate-700">Thời gian</TableHead>
                                <TableHead className="w-[100px] text-center font-bold text-slate-700">Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5} className="h-16 animate-pulse bg-slate-50/30" />
                                    </TableRow>
                                ))
                            ) : notifications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                                            <History className="h-10 w-10 text-slate-100" />
                                            <p className="font-medium">Chưa có lịch sử thông báo nào</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                notifications.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {(item as any).nguoi_dung?.ho_va_ten?.charAt(0) || 'K'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900">{(item as any).nguoi_dung?.ho_va_ten || 'Khách hàng'}</span>
                                                    <span className="text-[10px] text-slate-400 truncate w-24">{(item as any).nguoi_dung?.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 mb-1">
                                                {getIcon(item.loai)}
                                                <Badge variant="outline" className={`
                                                    text-[10px] px-1.5 py-0 border-none uppercase font-bold
                                                    ${item.loai === 'khuyen_mai' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}
                                                `}>
                                                    {item.loai === 'khuyen_mai' ? 'Khuyến mãi' : 'Hệ thống'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.tieu_de}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-slate-500 line-clamp-2 max-w-sm">
                                                {item.noi_dung}
                                            </p>
                                            {(() => {
                                                if (!item.du_lieu_them) return null;
                                                try {
                                                    const payload = typeof item.du_lieu_them === 'string' 
                                                        ? JSON.parse(item.du_lieu_them) 
                                                        : item.du_lieu_them;
                                                    if (payload?.link) {
                                                        return (
                                                            <a href={payload.link} target="_blank" rel="noreferrer" className="text-[10px] text-rose-500 font-medium hover:underline mt-1.5 flex items-center gap-1 w-fit bg-rose-50 px-2 py-0.5 rounded">
                                                                <LinkIcon className="h-2.5 w-2.5" />
                                                                Link đính kèm
                                                            </a>
                                                        );
                                                    }
                                                } catch(e) {}
                                                return null;
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(item.created_at), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.da_doc_luc ? (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold">
                                                    Đã xem
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-slate-100 text-slate-400 border-none text-[10px] font-bold">
                                                    Chưa xem
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            Hiển thị trang <span className="font-bold">{meta.current_page}</span> / {meta.last_page}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="h-8 bg-white"
                            >
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === meta.last_page}
                                onClick={() => setPage(page + 1)}
                                className="h-8 bg-white"
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <BroadcastDialog 
                open={isBroadcastOpen} 
                onOpenChange={setIsBroadcastOpen} 
            />
        </div>
    );
}
