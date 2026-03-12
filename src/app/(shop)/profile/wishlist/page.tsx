'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function WishlistPage() {
    // For simplicity, just load page 1. Can implement pagination if needed.
    const { wishlistData, isLoading, error, toggleWishlist, isToggling } = useWishlist(1);

    const wishlist = wishlistData?.data || [];

    const handleRemove = async (productId: number) => {
        try {
            await toggleWishlist(productId);
            toast.success('Đã xóa khỏi danh sách yêu thích');
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sản phẩm yêu thích</h1>
                    <p className="text-slate-500">Danh sách các sản phẩm bạn đã lưu lại</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-white rounded-xl border border-rose-100">
                    <p className="text-rose-500 mb-2">Đã có lỗi xảy ra khi tải danh sách yêu thích.</p>
                </div>
            ) : wishlist.length === 0 ? (
                <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                            <Heart className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có sản phẩm yêu thích</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Bạn chưa lưu sản phẩm nào vào danh sách yêu thích. Hãy khám phá và lưu lại những sản phẩm bạn quan tâm nhé.
                        </p>
                        <Link href="/products">
                            <Button variant="outline" className="bg-white">
                                Mua sắm ngay
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => {
                        const product = item.san_pham;
                        const mainImage = product.anh_chinh?.duong_dan_anh || '/placeholder.png';
                        const currentPrice = product.gia_khuyen_mai || product.gia_goc;

                        return (
                            <Card key={item.id} className="group overflow-hidden transition-all hover:shadow-lg border-slate-200/60 flex flex-col">
                                <Link href={`/products/${product.duong_dan}`} className="relative aspect-square overflow-hidden bg-slate-50/50 block">
                                    <Image
                                        src={mainImage}
                                        alt={product.ten_san_pham}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </Link>
                                <CardContent className="p-4 flex flex-col flex-1 gap-3">
                                    <Link href={`/products/${product.duong_dan}`} className="font-semibold line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors">
                                        {product.ten_san_pham}
                                    </Link>

                                    <div className="flex items-center gap-2 mt-auto">
                                        <span className="font-bold text-lg text-primary">
                                            {formatCurrency(currentPrice)}
                                        </span>
                                        {product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_goc && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                {formatCurrency(product.gia_goc)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-slate-100/60 mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-white hover:bg-slate-50 border-slate-200"
                                            asChild
                                        >
                                            <Link href={`/products/${product.duong_dan}`}>
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Xem chi tiết
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemove(product.id)}
                                            disabled={isToggling}
                                            className="px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 flex-shrink-0"
                                            title="Xóa khỏi danh sách"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
