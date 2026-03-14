'use client';

import { useOrder, useOrderHistory } from '@/hooks/useOrder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PackageOpen, ChevronRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'cho_xac_nhan': return 'bg-amber-100 text-amber-800';
        case 'da_xac_nhan': return 'bg-blue-100 text-blue-800';
        case 'dang_xu_ly': return 'bg-indigo-100 text-indigo-800';
        case 'dang_giao': return 'bg-violet-100 text-violet-800';
        case 'da_giao': return 'bg-emerald-100 text-emerald-800';
        case 'da_huy': return 'bg-rose-100 text-rose-800';
        case 'hoan_tra': return 'bg-slate-100 text-slate-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'cho_xac_nhan': return 'Chờ xác nhận';
        case 'da_xac_nhan': return 'Đã xác nhận';
        case 'dang_xu_ly': return 'Đang xử lý';
        case 'dang_giao': return 'Đang giao hàng';
        case 'da_giao': return 'Giao thành công';
        case 'da_huy': return 'Đã hủy';
        case 'hoan_tra': return 'Hoàn trả';
        default: return status;
    }
};

export default function OrderHistoryPage() {
    const { data: orderHistory, isLoading: isLoadingHistory } = useOrderHistory(1);
    const { createPaymentUrl, isCreatingPaymentUrl } = useOrder();

    console.log('--- RAW ORDER HISTORY ---', orderHistory);

    // orderHistory is the JSON payload containing { success, message, data: [], meta: {} }
    // We already reverted order.service.ts to returning the interceptor's payload correctly.
    const orders = orderHistory?.data || [];

    if (isLoadingHistory) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>

            {orders.length === 0 ? (
                <Card className="border-dashed shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <PackageOpen className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                            Bạn chưa thực hiện bất kỳ giao dịch nào. Hãy khám phá các sản phẩm nổi bật của chúng tôi!
                        </p>
                        <Link href="/products">
                            <Button>Tiếp tục mua sắm</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => {
                        const firstItem = order.items?.[0];
                        const moreItemsCount = (order.items?.length || 1) - 1;

                        return (
                            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200/60">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mã đơn hàng</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-mono font-bold text-slate-900">{order.ma_don_hang}</p>
                                                {order.trang_thai_tt === 'da_thanh_toan' ? (
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Đã thanh toán</span>
                                                ) : (order.phuong_thuc_tt !== 'cod' && order.trang_thai !== 'da_huy') && (
                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">Chưa thanh toán</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Ngày đặt</p>
                                            <p className="text-sm text-slate-900">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.trang_thai)}`}>
                                            {getStatusText(order.trang_thai)}
                                        </div>
                                        {/* Nút Thanh toán lại */}
                                        {(order.trang_thai_tt === 'chua_thanh_toan' && (order.phuong_thuc_tt === 'vnpay' || order.phuong_thuc_tt === 'momo') && order.trang_thai !== 'da_huy') && (
                                            <Button 
                                                size="sm" 
                                                variant="default" 
                                                className="h-8 text-xs bg-primary hover:bg-primary/90 shadow-sm"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const loadingToast = toast.loading('Đang khởi tạo lại thanh toán...');
                                                    try {
                                                        const res = await createPaymentUrl({
                                                            ma_don_hang: order.ma_don_hang,
                                                            phuong_thuc: order.phuong_thuc_tt
                                                        });
                                                        if (res.data.payment_url) {
                                                            window.location.href = res.data.payment_url;
                                                        }
                                                    } catch (err: any) {
                                                        toast.dismiss(loadingToast);
                                                        toast.error(err?.message || 'Không thể tạo lại liên kết thanh toán.');
                                                    }
                                                }}
                                                disabled={isCreatingPaymentUrl}
                                            >
                                                {isCreatingPaymentUrl ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CreditCard className="h-3 w-3 mr-1" />}
                                                Thanh toán ngay
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <CardContent className="p-0">
                                    <Link href={`/profile/orders/${order.ma_don_hang}`} className="block px-6 py-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {firstItem && (
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                                        <Image
                                                            src={firstItem.san_pham?.anh_chinh?.duong_dan_anh || '/placeholder.png'}
                                                            alt={firstItem.ten_san_pham}
                                                            fill
                                                            unoptimized
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{firstItem?.ten_san_pham}</h4>
                                                    {firstItem?.thong_tin_bien_the && (
                                                        <p className="text-xs text-slate-500 mt-1">Phân loại: {firstItem.thong_tin_bien_the}</p>
                                                    )}
                                                    <div className="flex items-center space-x-2 mt-1.5">
                                                        <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">x{firstItem?.so_luong}</span>
                                                        {moreItemsCount > 0 && (
                                                            <span className="text-xs text-slate-500">và {moreItemsCount} sản phẩm khác</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-xs text-slate-500">Tổng thanh toán</p>
                                                    <p className="text-lg font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(order.tong_tien)} ₫</p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-300" />
                                            </div>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
