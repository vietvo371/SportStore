'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bell, CheckCheck, Info, Tag, ShoppingBag, BadgeCheck,
    RefreshCw, ArrowLeft, BellOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotifications, useMarkAllRead, useMarkRead } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const ICON_MAP: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
    khuyen_mai:         { icon: Tag,         bg: 'bg-rose-50',    color: 'text-rose-500' },
    trang_thai_don:     { icon: ShoppingBag,  bg: 'bg-indigo-50',  color: 'text-indigo-500' },
    danh_gia_duoc_duyet:{ icon: BadgeCheck,  bg: 'bg-emerald-50', color: 'text-emerald-500' },
    he_thong:           { icon: Info,        bg: 'bg-blue-50',    color: 'text-blue-500' },
};

export default function UserNotificationsPage() {
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { data: response, isLoading, refetch } = useNotifications({ page });
    const markRead = useMarkRead();
    const markAllRead = useMarkAllRead();

    const notifications = response?.data || [];
    const meta = response?.meta;
    const unreadCount = notifications.filter(n => !n.da_doc_luc).length;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost" size="sm" onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5"
            >
                <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Thông báo của tôi</h1>
                        <p className="text-sm text-slate-500">Cập nhật tin tức mới nhất về đơn hàng và khuyến mãi</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button
                            variant="outline" size="sm"
                            onClick={() => markAllRead.mutate()}
                            disabled={markAllRead.isPending}
                            className="gap-1.5 rounded-xl bg-white"
                        >
                            <CheckCheck className="h-4 w-4" /> Đánh dấu đã đọc
                        </Button>
                    )}
                    <Button
                        variant="ghost" size="icon"
                        onClick={() => refetch()}
                        className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl bg-white"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 flex gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 shrink-0" />
                            <div className="flex-1 space-y-2 pt-1">
                                <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                <div className="h-3 bg-slate-100 rounded-full w-full" />
                                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <BellOff className="h-8 w-8 text-slate-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Chưa có thông báo nào</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
                                Bạn sẽ nhận được thông báo khi có chương trình khuyến mãi hoặc cập nhật về đơn hàng.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="rounded-xl px-8 bg-white">
                            <a href="/products">Tiếp tục mua sắm</a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((item) => {
                        const cfg = ICON_MAP[item.loai] || ICON_MAP.he_thong;
                        const Icon = cfg.icon;

                        return (
                            <Card
                                key={item.id}
                                className={`overflow-hidden transition-all cursor-pointer border-slate-200/60 hover:shadow-sm ${
                                    !item.da_doc_luc ? 'bg-indigo-50/20 ring-1 ring-indigo-100' : 'bg-white'
                                }`}
                                onClick={() => {
                                    if (!item.da_doc_luc) markRead.mutate(item.id);

                                    if (item.du_lieu_them) {
                                        try {
                                            const payload = typeof item.du_lieu_them === 'string'
                                                ? JSON.parse(item.du_lieu_them)
                                                : item.du_lieu_them;
                                            if (payload?.link) router.push(payload.link);
                                        } catch {}
                                    }
                                }}
                            >
                                <CardContent className="p-5 flex gap-4">
                                    {/* Icon */}
                                    <div className={`h-12 w-12 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0 ${!item.da_doc_luc ? 'shadow-sm ring-2 ring-indigo-100' : ''}`}>
                                        <Icon className={`h-5 w-5 ${cfg.color}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className={`text-sm font-bold leading-tight ${!item.da_doc_luc ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {item.tieu_de}
                                                    </h4>
                                                    {!item.da_doc_luc && (
                                                        <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                                                    )}
                                                </div>
                                                <p className={`text-sm leading-relaxed ${!item.da_doc_luc ? 'text-slate-600' : 'text-slate-500'}`}>
                                                    {item.noi_dung}
                                                </p>
                                            </div>
                                            <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-2.5">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 h-5 rounded-lg border-none">
                                                {item.loai.replace(/_/g, ' ')}
                                            </Badge>
                                            <span className="text-xs font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                Xem chi tiết
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                        Trang <span className="font-bold">{meta.current_page}</span> / {meta.last_page}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline" size="sm"
                            disabled={page === 1}
                            onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="h-9 rounded-xl px-4 bg-white"
                        >
                            Trước
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            disabled={page === meta.last_page}
                            onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="h-9 rounded-xl px-4 bg-white"
                        >
                            Sau
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
