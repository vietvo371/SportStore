'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useOrderHistory } from '@/hooks/useOrder';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, PackageOpen, ChevronRight, CreditCard, ArrowLeft, ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    cho_xac_nhan: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    da_xac_nhan:  { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-400' },
    dang_xu_ly:   { label: 'Đang xử lý',    color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' },
    dang_giao:   { label: 'Đang giao',     color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400' },
    da_giao:     { label: 'Giao thành công', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
    da_huy:      { label: 'Đã hủy',        color: 'bg-rose-100 text-rose-700',    dot: 'bg-rose-400' },
    hoan_tra:    { label: 'Hoàn trả',       color: 'bg-slate-100 text-slate-700',  dot: 'bg-slate-400' },
};

export default function OrderHistoryPage() {
    const { data: orderHistory, isLoading: isLoadingHistory } = useOrderHistory(1);
    const { createPaymentUrl, isCreatingPaymentUrl } = useOrder();
    const router = useRouter();

    const orders = orderHistory?.data || [];

    if (isLoadingHistory) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost" size="sm" onClick={() => router.back()}
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

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
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
                    <p className="text-sm text-slate-500">Theo dõi và xem lịch sử đơn hàng của bạn</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <PackageOpen className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                            Bạn chưa thực hiện bất kỳ giao dịch nào. Hãy khám phá các sản phẩm nổi bật!
                        </p>
                        <Link href="/products">
                            <Button>Tiếp tục mua sắm</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {orders.map((order: any) => {
                        const firstItem = order.items?.[0];
                        const moreItemsCount = (order.items?.length || 1) - 1;
                        const cfg = STATUS_CONFIG[order.trang_thai] || {
                            label: order.trang_thai,
                            color: 'bg-slate-100 text-slate-700',
                            dot: 'bg-slate-400',
                        };

                        return (
                            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200/60 group">
                                {/* Top bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Mã đơn hàng</p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-slate-900 text-sm">{order.ma_don_hang}</span>
                                                {order.trang_thai_tt === 'da_thanh_toan' && (
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Đã thanh toán</span>
                                                )}
                                                {(order.trang_thai_tt === 'chua_thanh_toan' && order.phuong_thuc_tt !== 'cod' && order.trang_thai !== 'da_huy') && (
                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">Chưa thanh toán</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="hidden sm:block h-6 w-px bg-slate-200" />

                                        <div className="hidden sm:block text-xs">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Ngày đặt</p>
                                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                })}
                                            </div>
                                        </div>

                                        <div className="hidden md:block h-6 w-px bg-slate-200" />

                                        <div className="hidden md:block text-xs">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Tổng tiền</p>
                                            <p className="font-bold text-primary text-sm">
                                                {new Intl.NumberFormat('vi-VN').format(order.tong_tien)}đ
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge className={`${cfg.color} font-semibold text-xs px-2.5 py-1 rounded-full gap-1.5`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                            {cfg.label}
                                        </Badge>

                                        {(order.trang_thai_tt === 'chua_thanh_toan' && ['vnpay', 'momo'].includes(order.phuong_thuc_tt) && order.trang_thai !== 'da_huy') && (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="h-8 text-xs gap-1"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const t = toast.loading('Đang khởi tạo thanh toán...');
                                                    try {
                                                        const res = await createPaymentUrl({ ma_don_hang: order.ma_don_hang, phuong_thuc: order.phuong_thuc_tt });
                                                        if (res?.data?.payment_url) {
                                                            window.location.href = res.data.payment_url;
                                                        }
                                                    } catch (err: any) {
                                                        toast.dismiss(t);
                                                        toast.error(err?.message || 'Không thể tạo liên kết thanh toán');
                                                    }
                                                }}
                                                disabled={isCreatingPaymentUrl}
                                            >
                                                <CreditCard className="h-3 w-3" />
                                                Thanh toán ngay
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Product items */}
                                <Link href={`/profile/orders/${order.ma_don_hang}`} className="block px-5 py-4 hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {firstItem && (
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                    <Image
                                                        src={firstItem.san_pham?.anh_chinh?.duong_dan_anh || '/placeholder.png'}
                                                        alt={firstItem.ten_san_pham}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 line-clamp-1">{firstItem?.ten_san_pham}</p>
                                                {firstItem?.thong_tin_bien_the && (
                                                    <p className="text-xs text-slate-500 mt-0.5">{firstItem.thong_tin_bien_the}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">x{firstItem?.so_luong}</span>
                                                    {moreItemsCount > 0 && (
                                                        <span className="text-xs text-slate-400">và {moreItemsCount} sản phẩm khác</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </div>
                                </Link>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
