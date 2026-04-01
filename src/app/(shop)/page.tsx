'use client';

import { useQuery } from '@tanstack/react-query';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrandsTab } from '@/components/brand/BrandsTab';
import { RecommendationSection } from '@/components/recommendation/RecommendationSection';
import { Truck, ShieldCheck, RefreshCcw } from 'lucide-react';

export default function Home() {
    const { data: featuredProducts = [], isLoading } = useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => productService.getFeaturedProducts(8),
    });

    return (
        <div className="flex flex-col gap-0 pb-0 bg-white">
            
            {/* Edge to Edge Hero Section */}
            <section className="w-full relative">
                <HeroBanner />
            </section>


            {/* Featured Products Section (With Watermark Typography and Deep Contrast) */}
            <section className="container mx-auto px-4 mt-12 mb-16 relative">
                
                {/* Background Watermark */}
                <div className="absolute top-0 right-0 z-0 pointer-events-none select-none overflow-hidden h-full flex items-start justify-end opacity-[0.02]">
                    <span className="text-[12rem] md:text-[20rem] font-black leading-none whitespace-nowrap -rotate-90 origin-top-right translate-x-32 mt-32">TRENDING</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 relative z-10 gap-6">
                    <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center gap-3">
                            <span className="h-[3px] w-8 sm:w-12 bg-red-600 block rounded-full"></span>
                            <span className="text-red-600 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs">Sản phẩm mới</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">
                            Mới Nhất <span className="text-slate-200 font-light mx-1 lg:mx-2 select-none italic">/</span> <span className="text-red-600 drop-shadow-sm">Nổi Bật</span>
                        </h2>
                    </div>
                    
                    <Link href="/products" className="group">
                        <Button variant="outline" className="h-12 px-8 rounded-full border-slate-300 font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-all w-full sm:w-auto">
                            Khám Phá Tất Cả
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 relative z-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-2xl" />
                                <div className="w-2/3 h-5 bg-slate-100 animate-pulse rounded-md mt-2" />
                                <div className="w-1/3 h-6 bg-slate-100 animate-pulse rounded-md" />
                            </div>
                        ))}
                    </div>
                ) : featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 relative z-10">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl relative z-10 border border-slate-100">
                        <p className="text-slate-400 font-medium text-lg">Hệ thống đang cập nhật siêu phẩm mới. Bạn quay lại sau nhé!</p>
                    </div>
                )}
            </section>

            {/* Recommendations Section (Clean Light Minimalist UI) */}
            <section className="container mx-auto px-4 py-16 border-t border-slate-100 relative" id="recommendations">
                
                {/* Very subtle background accent */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 opacity-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex flex-col items-center text-center mb-16 relative z-10">
                    <span className="px-5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase mb-6 border border-red-100 shadow-sm">
                        Được Tuyển Chọn
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter text-slate-900 uppercase mb-4">
                        Dành Riêng Cho Bạn
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-xl">
                        Những siêu phẩm được cá nhân hóa dựa trên gu thể thao của bạn.
                    </p>
                </div>

                <div className="relative z-10">
                    <RecommendationSection title="" subtitle="" />
                </div>
            </section>

            {/* Brands Section */}
            <section className="container mx-auto px-4 pt-16 pb-20" id="brands">
                <div className="flex flex-col items-center justify-center mb-16">
                    <div className="text-center max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase mb-6">
                            Thương Hiệu Đồng Hành
                        </h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            SPORTSTORE tự hào phân phối chính hãng các bộ sưu tập đẳng cấp nhất từ những ông lớn ngành công nghiệp thể thao toàn cầu.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100">
                    <BrandsTab />
                </div>
            </section>
        </div>
    );
}
