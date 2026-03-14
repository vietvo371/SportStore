'use client';

import { useCartStore } from '@/store/cart.store';
import Cookies from 'js-cookie';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { toast } from 'sonner';

export function CartDrawer() {
    const { isOpen, closeCart, itemCount } = useCartStore();
    const { cart, isLoading, updateItem, removeItem, isUpdating, isRemoving } = useCart();

    // Hydration fix for Zustand
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return null;

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await updateItem({ id: itemId, payload: { so_luong: newQuantity } });
        } catch (error: any) {
            toast.error(error.message || 'Lỗi cập nhật số lượng');
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeItem(itemId);
            toast.success('Đã xóa khỏi giỏ hàng');
        } catch (error: any) {
            toast.error(error.message || 'Lỗi xóa sản phẩm');
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Giỏ hàng của bạn ({itemCount})
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Danh sách sản phẩm bạn đã thêm vào giỏ hàng
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p>Đang tải giỏ hàng...</p>
                        </div>
                    ) : itemCount === 0 || !cart?.items?.length ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="bg-slate-100 p-6 rounded-full text-slate-400">
                                <ShoppingCart className="h-12 w-12" />
                            </div>
                            <p className="text-muted-foreground font-medium">Giỏ hàng đang trống</p>
                            <Button onClick={closeCart} variant="outline" className="mt-4">
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.items.map((item) => {
                                const prod = item.san_pham;
                                const variant = item.bien_the;
                                const imgUrl = variant?.hinh_anh || prod?.anh_chinh?.duong_dan_anh || '/placeholder.png';
                                return (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                                            <Image
                                                src={imgUrl}
                                                alt={prod?.ten_san_pham || 'Product'}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium line-clamp-2">
                                                    {prod?.ten_san_pham}
                                                </h4>
                                                {variant && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Phân loại: {variant.mau_sac} - {variant.kich_co}
                                                    </p>
                                                )}
                                                <div className="text-sm font-semibold text-primary mt-1">
                                                    {new Intl.NumberFormat('vi-VN').format(item.don_gia || 0)} ₫
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.so_luong - 1)}
                                                        disabled={isUpdating}
                                                        className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-50"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="text-sm font-medium w-8 text-center">
                                                        {item.so_luong}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.so_luong + 1)}
                                                        disabled={isUpdating}
                                                        className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-50"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={isRemoving}
                                                    className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {itemCount > 0 && cart && (
                    <div className="p-6 border-t bg-slate-50">
                        <div className="flex justify-between font-semibold mb-4 text-lg">
                            <span>Tổng tiền:</span>
                            <span className="text-primary">
                                {new Intl.NumberFormat('vi-VN').format(cart?.tam_tinh || 0)} ₫
                            </span>
                        </div>
                        <Button
                            className="w-full h-12 text-lg font-medium"
                            onClick={() => {
                                const token = Cookies.get('token');
                                if (!token) {
                                    toast.error('Vui lòng đăng nhập để tiếp tục thanh toán.');
                                    // Chuyển hướng tới login với callbackUrl
                                    window.location.href = `/login?callbackUrl=/checkout`;
                                    return;
                                }
                                closeCart();
                                window.location.href = '/checkout';
                            }}
                        >
                            Đặt Hàng Ngay
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
