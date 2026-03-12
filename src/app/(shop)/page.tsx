'use client';

import { useQuery } from '@tanstack/react-query';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrandsTab } from '@/components/brand/BrandsTab';

export default function Home() {
    const { data: featuredProducts = [], isLoading } = useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => productService.getFeaturedProducts(8),
    });

    return (
        <div className="flex flex-col gap-16 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mt-6">
                <HeroBanner />
            </section>

            {/* Featured Products Section */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Sản Phẩm Mới & Nổi Bật</h2>
                        <p className="text-muted-foreground mt-2">
                            Khám phá những mẫu giày bóng đá và trang phục thể thao mới nhất
                        </p>
                    </div>
                    <Link href="/products">
                        <Button variant="outline" className="hidden sm:flex">
                            Xem tất cả
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl" />
                                <div className="w-2/3 h-4 bg-slate-100 animate-pulse rounded mt-2" />
                                <div className="w-1/3 h-5 bg-slate-100 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                ) : featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                        <p className="text-muted-foreground">Không có sản phẩm nào để hiển thị.</p>
                    </div>
                )}

                <div className="mt-8 flex justify-center sm:hidden">
                    <Link href="/products" className="w-full">
                        <Button variant="outline" className="w-full">
                            Xem tất cả sản phẩm
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Brands Section */}
            <section className="container mx-auto px-4 mt-8" id="brands">
                <div className="flex items-center justify-center mb-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Thương Hiệu Đồng Hành</h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl">
                            SPORTSTORE hân hạnh phân phối chính hãng các sản phẩm thể thao chất lượng cao từ các thương hiệu uy tín hàng đầu.
                        </p>
                    </div>
                </div>

                <BrandsTab />
            </section>
        </div>
    );
}
