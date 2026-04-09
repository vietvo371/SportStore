'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAddress } from '@/hooks/useAddress';
import { useOrder } from '@/hooks/useOrder';
import { useCartStore } from '@/store/cart.store';
import { useBuyNowStore } from '@/store/buyNow.store';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MapPin, CreditCard, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { AddAddressModal } from '@/components/checkout/AddAddressModal';
import { useCoupon } from '@/hooks/useCoupon';
import { CouponResponse } from '@/types/coupon.types';
import { Tag, X } from 'lucide-react';

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cart, isLoading: isCartLoading } = useCart();
    const { addresses, isLoading: isAddressesLoading } = useAddress();
    const { placeOrder, isPlacing, buyNow, isBuyingNow, createPaymentUrl, isCreatingPaymentUrl } = useOrder();
    const { validateCoupon, isValidating: isVerifyingCoupon } = useCoupon();
    const clearCartStore = useCartStore((state) => state.clearCart);

    const buyNowItem = useBuyNowStore((s) => s.buyNowItem);
    const clearBuyNowItem = useBuyNowStore((s) => s.clearBuyNowItem);
    const isBuyNowMode = searchParams.get('buyNow') === '1' && !!buyNowItem;

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'chuyen_khoan' | 'vnpay' | 'momo'>('cod');
    const [note, setNote] = useState('');

    // Coupon States
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResponse | null>(null);

    // Computed values for dual mode
    const displayItems = isBuyNowMode && buyNowItem
        ? [{
            id: 'buy-now',
            san_pham: buyNowItem.san_pham,
            bien_the: buyNowItem.bien_the,
            don_gia: buyNowItem.don_gia,
            so_luong: buyNowItem.so_luong,
        }]
        : cart?.items || [];

    const tamTinh = isBuyNowMode && buyNowItem
        ? buyNowItem.don_gia * buyNowItem.so_luong
        : cart?.tam_tinh || 0;

    const tongSoLuong = isBuyNowMode && buyNowItem
        ? buyNowItem.so_luong
        : cart?.tong_so_luong || 0;

    useEffect(() => {
        if (addresses && addresses.length > 0) {
            const defaultAddr = addresses.find((a: any) => a.la_mac_dinh);
            setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
        }
    }, [addresses]);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        if (!tamTinh) return;

        try {
            const res = await validateCoupon({
                ma_code: couponInput.trim(),
                tam_tinh: tamTinh,
            });
            setAppliedCoupon(res);
            toast.success(`Áp dụng mã ${res.ma_code} thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(res.so_tien_giam)}đ`);
        } catch (error: any) {
            setAppliedCoupon(null);
            const errMsgs = error?.errors ? Object.values(error.errors).flat().join(', ') : error?.message;
            toast.error(errMsgs || 'Mã giảm giá không hợp lệ.');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error('Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        try {
            let res;

            if (isBuyNowMode && buyNowItem) {
                res = await buyNow({
                    san_pham_id: buyNowItem.san_pham_id,
                    bien_the_id: buyNowItem.bien_the_id,
                    so_luong: buyNowItem.so_luong,
                    dia_chi_id: selectedAddressId,
                    phuong_thuc_tt: paymentMethod,
                    ma_coupon: appliedCoupon?.ma_code,
                    ghi_chu: note,
                });
            } else {
                res = await placeOrder({
                    dia_chi_id: selectedAddressId,
                    phuong_thuc_tt: paymentMethod,
                    ma_coupon: appliedCoupon?.ma_code,
                    ghi_chu: note,
                });
            }

            if (paymentMethod === 'vnpay' || paymentMethod === 'momo') {
                const loadingToast = toast.loading(`Đơn hàng #${res.data.ma_don_hang} đã được tiếp nhận. Đang chuyển hướng tới cổng thanh toán...`);

                try {
                    const payRes = await createPaymentUrl({
                        ma_don_hang: res.data.ma_don_hang,
                        phuong_thuc: paymentMethod
                    });

                    if (payRes.data.payment_url) {
                        if (isBuyNowMode) clearBuyNowItem();
                        window.location.href = payRes.data.payment_url;
                        return;
                    }
                } catch (error) {
                    toast.dismiss(loadingToast);
                    toast.error('Đơn hàng đã được tạo nhưng không thể khởi tạo thanh toán trực tuyến ngay bây giờ. Vui lòng thanh toán tại Lịch sử đơn hàng.');
                    if (isBuyNowMode) clearBuyNowItem();
                    router.push('/profile/orders');
                    return;
                }
            } else {
                toast.success('Đặt hàng thành công!');
                if (isBuyNowMode) {
                    clearBuyNowItem();
                } else {
                    clearCartStore();
                }
                router.push(`/checkout/success?order=${res.data.ma_don_hang}`);
            }
        } catch (error: any) {
            const errMsgs = error?.errors ? Object.values(error.errors).flat().join(', ') : error?.message;
            toast.error(errMsgs || 'Lỗi đặt hàng. Vui lòng thử lại sau.');
        }
    };

    const isLoading = isBuyNowMode ? isAddressesLoading : (isCartLoading || isAddressesLoading);
    const isProcessing = isPlacing || isBuyingNow || isCreatingPaymentUrl;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (displayItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-md">
                <div className="bg-slate-100 p-8 rounded-full inline-block mb-6">
                    <ShoppingBag className="h-16 w-16 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Không có sản phẩm để thanh toán</h2>
                <p className="text-muted-foreground mb-8">Vui lòng thêm sản phẩm vào giỏ hoặc chọn Mua ngay từ trang sản phẩm.</p>
                <Link href="/products">
                    <Button size="lg" className="w-full">Trở lại cửa hàng</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 bg-slate-50/50 min-h-screen">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Shipping & Payment */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <Card className="shadow-sm border-slate-200/60 overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="flex items-center text-xl">
                                <MapPin className="mr-2 h-5 w-5 text-primary" />
                                Địa Chỉ Giao Hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            {addresses && addresses.length > 0 ? (
                                <RadioGroup
                                    value={selectedAddressId?.toString()}
                                    onValueChange={(val) => setSelectedAddressId(Number(val))}
                                    className="space-y-4"
                                >
                                    {addresses.map((addr: any) => (
                                        <div key={addr.id} className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                                            <RadioGroupItem value={addr.id.toString()} id={`addr-${addr.id}`} className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor={`addr-${addr.id}`} className="font-semibold text-base cursor-pointer">
                                                    {addr.ho_va_ten} <span className="text-muted-foreground font-normal ml-2">{addr.so_dien_thoai}</span>
                                                    {addr.la_mac_dinh && (
                                                        <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                                            Mặc định
                                                        </span>
                                                    )}
                                                </Label>
                                                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                                                    {addr.dia_chi_cu_the}, {addr.phuong_xa}, {addr.quan_huyen}, {addr.tinh_thanh}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <AddAddressModal />
                                    </div>
                                </RadioGroup>
                            ) : (
                                <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <p className="text-muted-foreground mb-4">Bạn chưa có địa chỉ giao hàng nào.</p>
                                    <AddAddressModal />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200/60 overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="flex items-center text-xl">
                                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                                Phương Thức Thanh Toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={(val: any) => setPaymentMethod(val)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                                    <RadioGroupItem value="cod" id="payment-cod" />
                                    <Label htmlFor="payment-cod" className="font-medium cursor-pointer flex-1">
                                        Thanh toán khi nhận hàng (COD)
                                    </Label>
                                </div>
                                <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                                    <RadioGroupItem value="vnpay" id="payment-vnpay" />
                                    <Label htmlFor="payment-vnpay" className="font-medium cursor-pointer flex-1">
                                        VNPay
                                    </Label>
                                </div>
                                <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'momo' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                                    <RadioGroupItem value="momo" id="payment-momo" />
                                    <Label htmlFor="payment-momo" className="font-medium cursor-pointer flex-1">
                                        Ví MoMo
                                    </Label>
                                </div>
                            </RadioGroup>

                            <div className="mt-6 pt-6 border-t">
                                <Label htmlFor="note" className="text-base font-semibold mb-2 block">Ghi chú đơn hàng (Tùy chọn)</Label>
                                <Input
                                    id="note"
                                    placeholder="Ví dụ: Giao hàng vào giờ hành chính..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                    <Card className="shadow-lg border-primary/10 overflow-hidden relative">
                        {/* Decorative top border */}
                        <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-400 absolute top-0 left-0" />

                        <CardHeader className="bg-white pb-4 pt-6">
                            <CardTitle className="text-xl">Đơn Hàng Của Bạn</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 bg-white">
                            <div className="max-h-[40vh] overflow-y-auto px-6 py-2 space-y-4">
                                {displayItems.map((item: any) => {
                                    const prod = item.san_pham;
                                    const variant = item.bien_the;
                                    const imgUrl = variant?.hinh_anh || prod?.anh_chinh?.duong_dan_anh || '/placeholder.png';

                                    return (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                                <Image src={imgUrl} alt={prod?.ten_san_pham || 'Product'} fill unoptimized className="object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-sm font-medium line-clamp-2 text-slate-800 leading-tight">
                                                    {prod?.ten_san_pham}
                                                </h4>
                                                {variant && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Phân loại: {variant.mau_sac} - {variant.kich_co}
                                                    </p>
                                                )}
                                                <div className="flex justify-between items-center mt-1.5">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {new Intl.NumberFormat('vi-VN').format(item.don_gia || 0)} ₫
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                        x{item.so_luong}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="px-6 py-6 bg-slate-50 mt-4 space-y-3">
                                {/* MÃ GIẢM GIÁ */}
                                <div className="mb-4">
                                    {!appliedCoupon ? (
                                        <div className="flex space-x-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Nhập mã giảm giá..."
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                    className="pl-9 h-10 bg-white"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleApplyCoupon();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                onClick={handleApplyCoupon}
                                                disabled={isVerifyingCoupon || !couponInput.trim()}
                                                variant="secondary"
                                            >
                                                {isVerifyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                                            <div className="flex items-center space-x-2">
                                                <Tag className="h-4 w-4" />
                                                <span className="font-semibold">{appliedCoupon.ma_code}</span>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-emerald-600 hover:text-emerald-900 transition-colors"
                                                title="Xóa mã giảm giá"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tạm tính ({tongSoLuong} sản phẩm)</span>
                                    <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(tamTinh)} ₫</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-emerald-600 font-medium pb-1">
                                        <span>Giảm giá (Coupon)</span>
                                        <span>-{new Intl.NumberFormat('vi-VN').format(appliedCoupon.so_tien_giam)} ₫</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Phí giao hàng</span>
                                    <span className="font-medium text-emerald-600">Miễn phí</span>
                                </div>

                                <Separator className="my-3 opacity-50" />

                                <div className="flex justify-between items-end">
                                    <span className="text-base font-semibold text-slate-900">Tổng cộng</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-primary block">
                                            {new Intl.NumberFormat('vi-VN').format(
                                                Math.max(0, tamTinh - (appliedCoupon?.so_tien_giam || 0))
                                            )} ₫
                                        </span>
                                        <span className="text-xs text-muted-foreground">(Đã bao gồm VAT)</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 mt-6 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || !selectedAddressId}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            {isCreatingPaymentUrl ? 'Đang chuyển hướng...' : 'Đang Xử Lý...'}
                                        </>
                                    ) : (
                                        'Hoàn Tất Đặt Hàng'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
