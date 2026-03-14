'use client';

import { useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle2, Package, MapPin, Tag, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { OrderItem } from '@/types/order.types';
import { ReviewModal } from '@/components/product/ReviewModal';
import { useOrder, useOrderDetails } from '@/hooks/useOrder';
import { toast } from 'sonner';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'cho_xac_nhan': return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">Chờ xác nhận</span>;
        case 'dang_giao': return <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-xs font-semibold">Đang giao hàng</span>;
        case 'da_giao': return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">Giao thành công</span>;
        case 'da_huy': return <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-semibold">Đã hủy</span>;
        default: return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
};

export default function OrderDetailsPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const { data: responseData, isLoading, error, refetch } = useOrderDetails(code);
    const { createPaymentUrl, isCreatingPaymentUrl } = useOrder();

    const order = responseData?.data; // The interceptor returns { success, data } from API

    const [selectedReviewItem, setSelectedReviewItem] = useState<{ id: number, name: string } | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 mb-4">Không tìm thấy đơn hàng này.</p>
                <Link href="/profile/orders">
                    <Button variant="outline">Quay lại danh sách</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/profile/orders">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Chi tiết Đơn hàng</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Info */}
                    <Card className="border-slate-200/60 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Mã: {order.ma_don_hang}</CardTitle>
                                <p className="text-sm text-slate-500">Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN')} lúc {new Date(order.created_at).toLocaleTimeString('vi-VN')}</p>
                            </div>
                            <div>
                                {getStatusBadge(order.trang_thai)}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {order.items?.map((item: OrderItem) => (
                                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                                <Image
                                                    src={item.san_pham?.anh_chinh?.duong_dan_anh || '/placeholder.png'}
                                                    alt={item.ten_san_pham}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <Link href={`/products/${item.san_pham?.duong_dan}`} className="font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1">
                                                    {item.ten_san_pham}
                                                </Link>
                                                {item.thong_tin_bien_the && (
                                                    <p className="text-sm text-slate-500 mt-1">Phân loại: {item.thong_tin_bien_the}</p>
                                                )}
                                                <div className="mt-2 text-primary font-medium text-sm">
                                                    {new Intl.NumberFormat('vi-VN').format(item.don_gia)} ₫ <span className="text-slate-400 font-normal">x {item.so_luong}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 mb-1">Thành tiền</p>
                                                <p className="font-bold text-slate-900">{new Intl.NumberFormat('vi-VN').format(item.thanh_tien)} ₫</p>
                                            </div>
                                            {order.trang_thai === 'da_giao' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={order.danh_gia?.some((dg: any) => dg.san_pham_id === item.san_pham_id)}
                                                    className="mt-2 text-xs h-8 border-primary text-primary hover:bg-primary hover:text-white disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
                                                    onClick={() => setSelectedReviewItem({
                                                        id: item.san_pham_id,
                                                        name: item.ten_san_pham
                                                    })}
                                                >
                                                    {order.danh_gia?.some((dg: any) => dg.san_pham_id === item.san_pham_id)
                                                        ? 'Đã đánh giá'
                                                        : 'Viết đánh giá'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Timeline / Tracking stub */}
                    <Card className="border-slate-200/60 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center">
                                <Package className="h-5 w-5 mr-2 text-slate-400" /> Vận chuyển
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex space-x-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div className="w-px h-full bg-slate-200 my-2"></div>
                                </div>
                                <div className="pb-8">
                                    <p className="font-semibold text-slate-900">Đơn hàng đã được tạo</p>
                                    <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Summary */}
                    <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
                        <div className="h-1 w-full bg-primary absolute top-0 left-0" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Tổng kết khoản phí</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tiền hàng</span>
                                <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(order.tam_tinh)} ₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(order.phi_van_chuyen)} ₫</span>
                            </div>
                            {order.so_tien_giam > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                    <span>Giảm giá</span>
                                    <span>-{new Intl.NumberFormat('vi-VN').format(order.so_tien_giam)} ₫</span>
                                </div>
                            )}
                            <Separator className="my-3 opacity-60" />
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-slate-900">Tổng cộng</span>
                                <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(order.tong_tien)} ₫</span>
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm flex items-start space-x-2 border border-slate-100">
                                <Tag className="h-4 w-4 text-slate-400 mt-0.5" />
                                <div className="flex-1">
                                    <span className="text-slate-500 block mb-1">Phương thức thanh toán:</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-slate-800 uppercase">
                                            {order.phuong_thuc_tt === 'cod' ? 'Thanh toán khi nhận hàng' : order.phuong_thuc_tt}
                                        </span>
                                        {order.trang_thai_tt === 'da_thanh_toan' ? (
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Đã thanh toán</span>
                                        ) : (
                                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Chưa thanh toán</span>
                                        )}
                                    </div>

                                    {(order.trang_thai_tt === 'chua_thanh_toan' && (order.phuong_thuc_tt === 'vnpay' || order.phuong_thuc_tt === 'momo') && order.trang_thai !== 'da_huy') && (
                                        <Button 
                                            className="w-full mt-4 bg-primary hover:bg-primary/90 shadow-md group h-11 rounded-xl"
                                            onClick={async () => {
                                                const loadingToast = toast.loading('Đang khởi tạo lại thanh toán...');
                                                try {
                                                    const res = await createPaymentUrl({
                                                        ma_don_hang: order.ma_don_hang,
                                                        phuong_thuc: order.phuong_thuc_tt as 'vnpay' | 'momo'
                                                    });
                                                    if (res.data.payment_url) {
                                                        window.location.href = res.data.payment_url;
                                                    }
                                                } catch (err: any) {
                                                    toast.dismiss(loadingToast);
                                                    toast.error(err?.message || 'Lỗi khởi tạo thanh toán.');
                                                }
                                            }}
                                            disabled={isCreatingPaymentUrl}
                                        >
                                            <CreditCard className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                            Thanh toán ngay bây giờ
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address block */}
                    <Card className="border-slate-200/60 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-slate-400" /> Địa chỉ giao hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="font-semibold text-slate-900 mb-1">{order.ten_nguoi_nhan}</p>
                            <p className="text-slate-600 text-sm mb-3">Số điện thoại: {order.sdt_nguoi_nhan}</p>
                            <p className="text-slate-600 text-sm italic">{order.dia_chi_giao_hang}</p>

                            {order.ghi_chu && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">Ghi chú</p>
                                    <p className="text-sm text-slate-700 bg-amber-50 p-2 rounded border border-amber-100/50">{order.ghi_chu}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>

            {selectedReviewItem && (
                <ReviewModal
                    isOpen={!!selectedReviewItem}
                    onClose={() => setSelectedReviewItem(null)}
                    productName={selectedReviewItem.name}
                    productId={selectedReviewItem.id}
                    orderId={order.id}
                    onSuccess={() => {
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
