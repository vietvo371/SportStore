'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productService } from '@/services/product.service';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useBuyNowStore } from '@/store/buyNow.store';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RecommendationSection } from '@/components/recommendation/RecommendationSection';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SizeGuide } from '@/components/product/SizeGuide';

export default function ProductDetailClient({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<string>('/placeholder.png');
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const { openCart } = useCartStore();
    const { addToCart, isAdding } = useCart();
    const setBuyNowItem = useBuyNowStore((s) => s.setBuyNowItem);
    const { wishlistData, toggleWishlist, isToggling } = useWishlist();
    const { useTrackView, trackAction } = useBehaviorTracking();

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductBySlug(slug),
    });

    useTrackView(product?.id);

    const isWished = wishlistData?.data?.some(item => item.san_pham_id === product?.id) || false;

    const handleWishlist = async () => {
        if (!product) return;
        try {
            await toggleWishlist(product.id);
            if (!isWished) {
                toast.success('Đã thêm vào yêu thích!');
                trackAction(product.id, 'yeu_thich');
            }
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi yêu thích sản phẩm');
        }
    };

    // Sync active image when product is loaded
    useEffect(() => {
        if (product) {
            const imagesList = product.hinh_anh || product.hinh_anh_san_pham;
            const initialImage = product.anh_chinh?.url
                || imagesList?.find((img) => img.la_anh_chinh)?.url
                || imagesList?.[0]?.url
                || '/placeholder.png';
            setActiveImage(initialImage);
        }
    }, [product]);

    // Initial variant selection
    useEffect(() => {
        if (product?.bien_the && product.bien_the.length > 0) {
            const firstVariant = product.bien_the[0];
            setSelectedColor(firstVariant.mau_sac);
            setSelectedVariant(firstVariant);
        }
    }, [product]);

    // Update image/variant when color or size changes
    useEffect(() => {
        if (selectedVariant?.hinh_anh) {
            setActiveImage(selectedVariant.hinh_anh);
        }
    }, [selectedVariant]);

    // Handle color change: try to preserve size, otherwise pick first available size
    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        if (!product?.bien_the) return;
        const sizesForColor = product.bien_the.filter((v: any) => v.mau_sac === color);

        // Try to find if currently selected size exists in new color
        const matchingSizeVariant = sizesForColor.find((v: any) => v.kich_co === selectedVariant?.kich_co);

        if (matchingSizeVariant && matchingSizeVariant.ton_kho > 0) {
            setSelectedVariant(matchingSizeVariant);
        } else {
            // Pick first available size for this color
            const firstAvailable = sizesForColor.find((v: any) => v.ton_kho > 0) || sizesForColor[0];
            setSelectedVariant(firstAvailable);
        }
    };

    // New: Handle image click to select corresponding color if the image belongs to a variant
    const handleImageClick = (imageUrl: string) => {
        setActiveImage(imageUrl);

        // Find if this image is associated with any variant
        if (product?.bien_the) {
            const variantWithImage = product.bien_the.find((v: any) => v.hinh_anh === imageUrl);
            if (variantWithImage && variantWithImage.mau_sac && variantWithImage.mau_sac !== selectedColor) {
                handleColorChange(variantWithImage.mau_sac);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 aspect-square bg-slate-100 rounded-xl" />
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="h-8 bg-slate-100 rounded w-3/4" />
                        <div className="h-6 bg-slate-100 rounded w-1/4" />
                        <div className="h-24 bg-slate-100 rounded w-full" />
                    </div>
                </div>
            </div>
        );
    }
    if (isError || !product) {
        return notFound();
    }

    // Aggregate general product images and unique variant-specific images
    const generalImages = (product.hinh_anh || product.hinh_anh_san_pham || []).map((img: any) => ({
        id: `gen-${img.id || Math.random()}`,
        url: img.url || img.duong_dan_anh || ''
    }));

    const variantImages = (product.bien_the || [])
        .filter((v: any) => v.hinh_anh)
        .map((v: any, idx: number) => ({
            id: `var-${v.id || idx}`,
            url: v.hinh_anh
        }));

    // Combine and remove duplicates (by URL)
    const allImages = [...generalImages, ...variantImages];
    const imagesList = Array.from(new Map(allImages.map(img => [img.url, img])).values());

    // Use variant price if selected, otherwise product price
    const currentPrice = selectedVariant?.gia_rieng || product.gia_khuyen_mai || product.gia_goc;

    const maxStock = selectedVariant ? selectedVariant.ton_kho : (product.so_luong_ton_kho || 0);
    const isOutOfStock = maxStock <= 0;

    // Determine product type (loai) for size chart
    const getProductType = () => {
        const categoryName = product?.danh_muc?.ten?.toLowerCase() || '';
        if (categoryName.includes('giày') || categoryName.includes('dép')) return 'giay' as const;
        if (categoryName.includes('quần')) return 'quan' as const;
        return 'ao' as const; // Default to 'ao'
    };

    const productType = getProductType();

    // Group variants by color
    const uniqueColors = Array.from(new Set(product.bien_the?.map((v: any) => v.mau_sac) || []));
    const filteredSizes = product.bien_the?.filter((v: any) => v.mau_sac === selectedColor) || [];

    const handleAddToCart = async () => {
        if (product.bien_the && product.bien_the.length > 0 && !selectedVariant) {
            toast.error('Vui lòng chọn kích cỡ/phân loại sản phẩm.');
            return;
        }

        if (isOutOfStock) {
            toast.error('Sản phẩm hiện đang hết hàng.');
            return;
        }

        try {
            await addToCart({
                san_pham_id: product.id,
                so_luong: quantity,
                bien_the_id: selectedVariant?.id,
            });
            toast.success('Đã thêm vào giỏ hàng');
            trackAction(product.id, 'them_gio_hang');
            openCart();
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi thêm vào giỏ');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 w-fit transition-colors"
                aria-label="Quay lại"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </button>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 space-y-4">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border">
                        <Image
                            src={activeImage}
                            alt={product.ten_san_pham}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                        {product.noi_bat && (
                            <Badge className="absolute top-4 left-4 bg-amber-500 text-sm py-1">Hot</Badge>
                        )}
                    </div>

                    {imagesList && imagesList.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {imagesList.map((img) => {
                                const imgUrl = img.url || '';
                                return (
                                    <div
                                        key={img.id}
                                        onClick={() => handleImageClick(imgUrl)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border shrink-0 cursor-pointer hover:ring-2 ring-primary transition-all ${activeImage === imgUrl ? 'ring-2 ring-primary border-primary' : 'border-slate-200'}`}
                                    >
                                        <Image src={imgUrl} alt="Thumbnail" fill unoptimized className="object-cover" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 flex flex-col">
                    {product.thuong_hieu && (
                        <span className="text-[11px] md:text-sm text-primary font-bold uppercase tracking-[0.1em] mb-2 px-3 py-1 bg-primary/5 rounded-full w-fit">
                            {product.thuong_hieu.ten}
                        </span>
                    )}

                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 leading-[1.2] md:leading-tight">
                        {product.ten_san_pham}
                    </h1>

                    <div className="flex items-baseline gap-3 mb-6 pb-6 border-b">
                        <span className="text-2xl md:text-3xl font-black text-slate-900">
                            {formatCurrency(currentPrice)}
                        </span>
                        {product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_goc && (
                            <span className="text-base md:text-lg text-muted-foreground line-through opacity-70">
                                {formatCurrency(product.gia_goc)}
                            </span>
                        )}
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        {product.mo_ta_ngan || 'Sản phẩm thể thao cao cấp chính hãng.'}
                    </p>

                    {/* Color Selection */}
                    {(uniqueColors.length > 0) && (
                        <div className="mb-8">
                            <span className="block font-medium text-slate-900 mb-4">Chọn màu sắc:</span>
                            <div className="flex flex-wrap gap-3">
                                {uniqueColors.map((color: any) => {
                                    const isSelected = selectedColor === color;
                                    const variantWithColor = product.bien_the?.find((v: any) => v.mau_sac === color);
                                    const hexColor = variantWithColor?.ma_mau_hex;

                                    return (
                                        <button
                                            key={color}
                                            onClick={() => handleColorChange(color)}
                                            style={{
                                                borderColor: isSelected && hexColor ? hexColor : undefined,
                                                backgroundColor: isSelected && hexColor ? `${hexColor}10` : isSelected ? undefined : 'white',
                                                boxShadow: isSelected && hexColor ? `0 0 0 1px ${hexColor}` : undefined
                                            }}
                                            className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                                                ${isSelected
                                                    ? (!hexColor ? 'border-primary bg-primary/5 ring-1 ring-primary' : '')
                                                    : 'border-slate-200 hover:border-slate-400'}`}
                                        >
                                            {hexColor && (
                                                <span
                                                    className="w-4 h-4 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: hexColor }}
                                                />
                                            )}
                                            <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                                {color}
                                            </span>
                                            {isSelected && (
                                                <span
                                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                                    style={{ backgroundColor: hexColor || 'var(--primary)' }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {filteredSizes.length > 0 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-medium text-slate-900">Chọn kích cỡ:</span>
                                {!product.bien_the?.some((v: any) => v.kich_co?.toLowerCase() === 'freesize') && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <span className="text-sm font-semibold text-red-600 cursor-pointer hover:underline underline-offset-4 transition-all hover:text-red-700 active:scale-95">Hướng dẫn chọn size</span>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl bg-white p-0 overflow-hidden outline-none border-none shadow-2xl rounded-3xl">
                                            <DialogHeader className="p-8 pb-2 space-y-2">
                                                <DialogTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">Tìm size phù hợp nhất</DialogTitle>
                                                <DialogDescription className="text-slate-500 text-base">
                                                    Gợi ý chính xác dựa trên thông số từ hệ thống SportStore.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="pb-4">
                                                <SizeGuide
                                                    loai={productType}
                                                    thuong_hieu_id={product.thuong_hieu_id}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {filteredSizes.map((variant: any) => {
                                    const outOfStock = variant.ton_kho <= 0;
                                    const isSelected = selectedVariant?.id === variant.id;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => !outOfStock && setSelectedVariant(variant)}
                                            disabled={outOfStock}
                                            className={`h-12 min-w-[3.5rem] px-4 rounded-lg border font-bold transition-all relative
                                                ${isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                                    : outOfStock
                                                        ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                                                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-700'}`}
                                        >
                                            {variant.kich_co}
                                            {outOfStock && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    )}

                    {/* Add to Cart Actions */}
                    <div className="grid grid-cols-1 sm:flex sm:items-center gap-3 md:gap-4 mt-auto">
                        <div className="flex gap-3 h-14">
                            <div className={`flex items-center border border-slate-200 rounded-xl h-full bg-slate-50/50 ${isOutOfStock ? 'opacity-50 bg-slate-100' : ''}`}>
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={isOutOfStock || quantity <= 1}
                                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors disabled:opacity-30"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-bold text-slate-800">{isOutOfStock ? 0 : quantity}</span>
                                <button
                                    onClick={() => {
                                        if (quantity < maxStock) setQuantity(q => q + 1);
                                        else toast.error(`Xin lỗi, chỉ còn ${maxStock} sản phẩm trong kho`);
                                    }}
                                    disabled={isOutOfStock || quantity >= maxStock}
                                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors disabled:opacity-30"
                                >
                                    +
                                </button>
                            </div>

                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1 h-full text-sm font-bold gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-600 transition-all rounded-xl shadow-sm"
                                onClick={handleAddToCart}
                                disabled={isAdding || isOutOfStock}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="hidden xs:inline">{isAdding ? 'Đang thêm...' : isOutOfStock ? 'Hết hàng' : 'Thêm Vào Giỏ'}</span>
                                <span className="xs:hidden">{isOutOfStock ? 'Hết' : 'Thêm Vào Giỏ'}</span>
                            </Button>
                        </div>

                        <div className="flex gap-3 h-14">
                            <Button
                                size="lg"
                                className="flex-1 h-full text-sm sm:text-base font-black bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-95 transition-all rounded-xl border-0"
                                onClick={() => {
                                    if ((product.bien_the?.length ?? 0) > 0 && !selectedVariant) {
                                        toast.error('Vui lòng chọn kích cỡ/phân loại sản phẩm.');
                                        return;
                                    }
                                    if (isOutOfStock) {
                                        toast.error('Sản phẩm hiện đang hết hàng.');
                                        return;
                                    }
                                    const token = Cookies.get('token');
                                    if (!token) {
                                        toast.error('Vui lòng đăng nhập để đặt hàng.');
                                        window.location.href = `/login?callbackUrl=${window.location.pathname}`;
                                        return;
                                    }
                                    setBuyNowItem({
                                        san_pham_id: product.id,
                                        bien_the_id: selectedVariant?.id ?? null,
                                        so_luong: quantity,
                                        don_gia: currentPrice,
                                        san_pham: {
                                            ten_san_pham: product.ten_san_pham,
                                            duong_dan: product.duong_dan,
                                            anh_chinh: {
                                                duong_dan_anh: product.anh_chinh?.url
                                                    || product.anh_chinh?.duong_dan_anh
                                                    || (product.hinh_anh || product.hinh_anh_san_pham)?.[0]?.url
                                                    || '/placeholder.png',
                                            },
                                        },
                                        bien_the: selectedVariant ? {
                                            kich_co: selectedVariant.kich_co,
                                            mau_sac: selectedVariant.mau_sac,
                                            hinh_anh: selectedVariant.hinh_anh,
                                        } : null,
                                    });
                                    trackAction(product.id, 'mua_hang');
                                    window.location.href = '/checkout?buyNow=1';
                                }}
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? 'Hết hàng' : 'Đặt Hàng Ngay'}
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className={`h-14 w-14 shrink-0 rounded-xl border-slate-200 transition-all ${isWished ? 'text-rose-500 border-rose-200 bg-rose-50 shadow-inner' : 'text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-50'}`}
                                onClick={handleWishlist}
                                disabled={isToggling}
                                title={isWished ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                            >
                                <Heart className="h-6 w-6" fill={isWished ? 'currentColor' : 'none'} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 border-t pt-8">
                <Tabs defaultValue="description" className="w-full">
                    <TabsList variant="line" className="flex w-full justify-start items-center bg-transparent border-b rounded-none h-auto p-0 gap-4 md:gap-8 mb-8 overflow-x-auto no-scrollbar">
                        <TabsTrigger
                            value="description"
                            className="text-base md:text-lg py-4 px-1 font-bold text-slate-400 data-[state=active]:text-slate-900 data-[state=active]:bg-transparent transition-all hover:text-slate-600 relative after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px] after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100 after:transition-all after:rounded-t-full"
                        >
                            Mô tả sản phẩm
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="text-base md:text-lg py-4 px-1 font-bold text-slate-400 data-[state=active]:text-slate-900 data-[state=active]:bg-transparent transition-all hover:text-slate-600 relative after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px] after:bg-primary after:opacity-0 data-[state=active]:after:opacity-100 after:transition-all after:rounded-t-full"
                        >
                            Đánh giá ({product.so_luot_danh_gia || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4 outline-none">
                        {product.mo_ta_day_du ? (
                            <div className="relative">
                                <div
                                    className={`prose prose-slate max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-primary transition-all duration-500 ${isDescExpanded ? 'max-h-[5000px]' : 'max-h-[300px] overflow-hidden'}`}
                                    dangerouslySetInnerHTML={{ __html: product.mo_ta_day_du }}
                                />
                                {!isDescExpanded && (
                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-2">
                                        <Button
                                            variant="outline"
                                            className="px-8 bg-white/90 border-slate-200 shadow-[0_-10px_40px_rgba(255,255,255,1)] text-slate-700 font-semibold rounded-full hover:bg-slate-50 hover:text-red-600 transition-all z-10"
                                            onClick={() => setIsDescExpanded(true)}
                                        >
                                            Xem thêm nội dung
                                        </Button>
                                    </div>
                                )}
                                {isDescExpanded && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-500 hover:text-red-600 font-medium transition-colors"
                                            onClick={() => setIsDescExpanded(false)}
                                        >
                                            Thu gọn nội dung
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed">
                                <p className="text-slate-500 italic">Đang cập nhật thêm thông tin mô tả chi tiết cho sản phẩm này.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4 outline-none">
                        <ProductReviews product={product} />
                    </TabsContent>
                </Tabs>
            </div>

            <div className="mt-16">
                <RecommendationSection productId={product.id} />
            </div>
        </div>
    );
}
