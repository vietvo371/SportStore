"use client";

import { useState } from "react";
import { 
    Bell, 
    CheckCheck, 
    ChevronRight, 
    Info, 
    Tag, 
    ShoppingBag, 
    BadgeCheck 
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNotifications, useMarkAllRead, useMarkRead } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: response, isLoading } = useNotifications();
    const markRead = useMarkRead();
    const markAllRead = useMarkAllRead();

    const notifications = response?.data || [];
    const unreadCount = notifications.filter(n => !n.da_doc_luc).length;

    const getIcon = (loai: string) => {
        switch (loai) {
            case 'khuyen_mai': return <Tag className="h-4 w-4 text-rose-500" />;
            case 'trang_thai_don': return <ShoppingBag className="h-4 w-4 text-indigo-500" />;
            case 'danh_gia_duoc_duyet': return <BadgeCheck className="h-4 w-4 text-emerald-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 mt-2 rounded-2xl shadow-2xl border-slate-100 overflow-hidden" align="end">
                <div className="flex items-center justify-between p-4 bg-white border-b border-slate-50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        Thông báo
                        {unreadCount > 0 && <Badge variant="secondary" className="bg-rose-50 text-rose-600 border-none font-bold text-[10px] uppercase">Mới</Badge>}
                    </h3>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 h-8"
                            onClick={() => markAllRead.mutate()}
                            disabled={markAllRead.isPending}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" /> Đọc tất cả
                        </Button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center space-y-2">
                            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-xs text-slate-400 italic">Đang tải...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400 space-y-2 py-20">
                            <Bell className="h-10 w-10 text-slate-100" />
                            <p className="text-sm font-medium">Bạn chưa có thông báo nào</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {notifications.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`
                                        p-4 hover:bg-slate-50/80 transition-colors cursor-pointer relative group
                                        ${!item.da_doc_luc ? 'bg-indigo-50/20' : ''}
                                    `}
                                    onClick={() => {
                                        if (!item.da_doc_luc) markRead.mutate(item.id);
                                        
                                        // Xử lý chuyển hướng nếu có link đính kèm
                                        if (item.du_lieu_them) {
                                            try {
                                                const payload = typeof item.du_lieu_them === 'string' 
                                                    ? JSON.parse(item.du_lieu_them) 
                                                    : item.du_lieu_them;
                                                    
                                                if (payload?.link) {
                                                    setOpen(false); // Đóng popover
                                                    router.push(payload.link);
                                                    return;
                                                }
                                            } catch (error) {
                                                console.error('Lỗi parse du_lieu_them', error);
                                            }
                                        }
                                    }}
                                >
                                    <div className="flex gap-3">
                                        <div className={`
                                            h-9 w-9 rounded-full flex items-center justify-center shrink-0 border
                                            ${!item.da_doc_luc ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100'}
                                        `}>
                                            {getIcon(item.loai)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm leading-tight ${!item.da_doc_luc ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                                    {item.tieu_de}
                                                </p>
                                                {!item.da_doc_luc && (
                                                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {item.noi_dung}
                                            </p>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-[10px] text-slate-400 flex items-center">
                                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                                                </span>
                                                <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <Link href="/profile/notifications" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                        Xem tất cả thông báo
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
