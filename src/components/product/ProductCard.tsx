import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { Product } from '@/types/product.types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { wishlistData, toggleWishlist, isToggling } = useWishlist();
    const wishlist = wishlistData?.data || [];
    const isWished = wishlist.some(item => item.san_pham_id === product.id);

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product detail
        e.stopPropagation();
        try {
            await toggleWishlist(product.id);
            if (isWished) {
                toast.success('Đã xóa khỏi danh sách yêu thích');
            } else {
                toast.success('Đã thêm vào yêu thích!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi thao tác');
        }
    };

    const mainImage = product.anh_chinh?.url
        || product.hinh_anh_san_pham?.find((img) => img.la_anh_chinh)?.url
        || product.hinh_anh_san_pham?.[0]?.url
        || '/placeholder.png'; // Fallback image

    const salePercent = product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_goc
        ? Math.round(((product.gia_goc - product.gia_khuyen_mai) / product.gia_goc) * 100)
        : 0;

    return (
        <Link href={`/products/${product.duong_dan}`} className="block h-full">
            <Card className="group flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-0 bg-slate-50/50">
                <CardContent className="p-0 relative aspect-square">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all shadow-sm ${isWished ? 'text-rose-500 hover:text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                        onClick={handleWishlist}
                        disabled={isToggling}
                    >
                        <Heart className="w-4 h-4" fill={isWished ? 'currentColor' : 'none'} />
                    </Button>
                    <Image
                        src={mainImage}
                        alt={product.ten_san_pham}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {product.noi_bat && (
                            <Badge className="bg-amber-500 w-fit">Mới</Badge>
                        )}
                        {salePercent > 0 && (
                            <Badge variant="destructive" className="w-fit">
                                -{salePercent}%
                            </Badge>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col flex-1 items-start p-4 gap-2">
                    {product.thuong_hieu ? (
                        <span className="text-xs text-muted-foreground uppercase font-semibold h-4">
                            {product.thuong_hieu.ten}
                        </span>
                    ) : (
                        <span className="h-4" /> // Placeholder for alignment
                    )}
                    <h3 className="font-medium line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors min-h-[2.5rem] md:min-h-[3rem]">
                        {product.ten_san_pham}
                    </h3>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                        <span className="font-bold text-lg text-primary">
                            {formatCurrency(product.gia_khuyen_mai || product.gia_goc)}
                        </span>
                        {product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_goc && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatCurrency(product.gia_goc)}
                            </span>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
