'use client';

import { useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function WishlistPage() {
    const { wishlistData, isLoading, error, toggleWishlist, isToggling } = useWishlist(1);
    const router = useRouter();

    const wishlist = wishlistData?.data || [];

    const handleRemove = async (productId: number) => {
        try {
            await toggleWishlist(productId);
            toast.success('Đã xóa khỏi danh sách yêu thích');
        } catch (err: any) {
            toast.error(err?.message || 'Có lỗi xảy ra');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5">
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </Button>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sản phẩm yêu thích</h1>
                    <p className="text-sm text-slate-500">
                        {wishlist.length > 0 ? `${wishlist.length} sản phẩm đã lưu` : 'Danh sách sản phẩm bạn đã lưu lại'}
                    </p>
                </div>
            </div>

            {error ? (
                <div className="text-center py-12 bg-white rounded-xl border border-rose-100">
                    <p className="text-rose-500">Đã có lỗi xảy ra khi tải danh sách yêu thích.</p>
                </div>
            ) : wishlist.length === 0 ? (
                <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Heart className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có sản phẩm yêu thích</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Hãy khám phá và lưu lại những sản phẩm bạn quan tâm nhé.
                        </p>
                        <Link href="/products">
                            <Button variant="outline" className="bg-white">Khám phá sản phẩm</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {wishlist.map((item) => {
                        const product = item.san_pham;
                        const mainImage = product.anh_chinh?.duong_dan_anh || '/placeholder.png';
                        const currentPrice = product.gia_khuyen_mai || product.gia_goc;
                        const salePercent = product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_goc
                            ? Math.round(((product.gia_goc - product.gia_khuyen_mai) / product.gia_goc) * 100)
                            : 0;

                        return (
                            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all border-slate-200/60 flex flex-col">
                                {/* Image */}
                                <Link href={`/products/${product.duong_dan}`} className="relative aspect-square overflow-hidden bg-slate-50/50 block">
                                    {salePercent > 0 && (
                                        <Badge variant="destructive" className="absolute top-2 left-2 z-10 rounded-lg text-[10px] font-bold">
                                            -{salePercent}%
                                        </Badge>
                                    )}
                                    <Image
                                        src={mainImage}
                                        alt={product.ten_san_pham}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.preventDefault(); handleRemove(product.id); }}
                                        disabled={isToggling}
                                        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-rose-500 hover:text-rose-600 shadow-sm transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </Link>

                                {/* Info */}
                                <CardContent className="p-4 flex flex-col flex-1 gap-2">
                                    <Link href={`/products/${product.duong_dan}`} className="font-semibold line-clamp-2 text-sm leading-snug hover:text-primary transition-colors">
                                        {product.ten_san_pham}
                                    </Link>

                                    <div className="flex items-center gap-2 mt-auto">
                                        <span className="font-bold text-primary text-base">
                                            {formatCurrency(currentPrice)}
                                        </span>
                                        {product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_goc && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                {formatCurrency(product.gia_goc)}
                                            </span>
                                        )}
                                    </div>

                                    <Button asChild size="sm" className="w-full rounded-lg mt-1 gap-1.5">
                                        <Link href={`/products/${product.duong_dan}`}>
                                            <ShoppingCart className="h-3.5 w-3.5" />
                                            Xem chi tiết
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
