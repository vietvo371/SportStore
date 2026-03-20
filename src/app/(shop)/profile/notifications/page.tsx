"use client";

import { useState } from "react";
import { 
    Bell, 
    CheckCheck, 
    ChevronRight, 
    Info, 
    Tag, 
    ShoppingBag, 
    BadgeCheck,
    Search,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNotifications, useMarkAllRead, useMarkRead } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function UserNotificationsPage() {
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { data: response, isLoading, refetch } = useNotifications({ page });
    const markRead = useMarkRead();
    const markAllRead = useMarkAllRead();

    const notifications = response?.data || [];
    const meta = response?.meta;
    const unreadCount = notifications.filter(n => !n.da_doc_luc).length;

    const getIcon = (loai: string) => {
        switch (loai) {
            case 'khuyen_mai': return <Tag className="h-5 w-5 text-rose-500" />;
            case 'trang_thai_don': return <ShoppingBag className="h-5 w-5 text-indigo-500" />;
            case 'danh_gia_duoc_duyet': return <BadgeCheck className="h-5 w-5 text-emerald-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <Bell className="h-6 w-6 text-indigo-600" />
                        </div>
                        Thông báo của tôi
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Cập nhật những tin tức mới nhất về khuyến mãi và đơn hàng của bạn.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 rounded-xl"
                            onClick={() => markAllRead.mutate()}
                            disabled={markAllRead.isPending}
                        >
                            <CheckCheck className="h-4 w-4 mr-2" /> Đánh dấu đã đọc
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => refetch()}
                        className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[500px]">
                {isLoading ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-400 font-medium">Đang tải thông báo...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-20 text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                            <Bell className="h-10 w-10 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">Chưa có thông báo nào</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                                Bạn sẽ nhận được thông báo khi có chương trình khuyến mãi hoặc cập nhật về đơn hàng.
                            </p>
                        </div>
                        <Button className="rounded-xl px-8" asChild variant="outline">
                            <a href="/products">Tiếp tục mua sắm</a>
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((item) => (
                            <div 
                                key={item.id} 
                                className={`
                                    p-6 hover:bg-slate-50/50 transition-all cursor-pointer relative group
                                    ${!item.da_doc_luc ? 'bg-indigo-50/10' : ''}
                                `}
                                onClick={() => {
                                    if (!item.da_doc_luc) markRead.mutate(item.id);
                                    
                                    if (item.du_lieu_them) {
                                        try {
                                            const payload = typeof item.du_lieu_them === 'string' 
                                                ? JSON.parse(item.du_lieu_them) 
                                                : item.du_lieu_them;
                                                
                                            if (payload?.link) {
                                                router.push(payload.link);
                                            }
                                        } catch (error) {
                                            console.error('Lỗi parse du_lieu_them', error);
                                        }
                                    }
                                }}
                            >
                                <div className="flex gap-5">
                                    <div className={`
                                        h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300
                                        ${!item.da_doc_luc 
                                            ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-100' 
                                            : 'bg-slate-50 border-slate-100'}
                                    `}>
                                        {getIcon(item.loai)}
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`text-base leading-tight ${!item.da_doc_luc ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                                        {item.tieu_de}
                                                    </h4>
                                                    {!item.da_doc_luc && (
                                                        <Badge className="bg-rose-500 text-[10px] h-4 px-1 border-none font-black uppercase tracking-widest">
                                                            Mới
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className={`text-sm leading-relaxed ${!item.da_doc_luc ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                                                    {item.noi_dung}
                                                </p>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap pt-1">
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex gap-2">
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase border-none px-2 h-5">
                                                    {item.loai.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                                Xem chi tiết <ChevronRight className="h-4 w-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            Hiển thị trang <span className="font-bold">{meta.current_page}</span> / {meta.last_page}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => {
                                    setPage(page - 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="h-9 bg-white rounded-xl px-4"
                            >
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === meta.last_page}
                                onClick={() => {
                                    setPage(page + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="h-9 bg-white rounded-xl px-4"
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
