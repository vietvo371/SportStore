'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useBrands } from '@/services/brand.service';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function BrandsTab() {
    const { data: brands, isLoading: brandsLoading } = useBrands();
    const [activeTab, setActiveTab] = useState<string>('');

    // Set first brand as active default when brands load
    if (brands && brands.length > 0 && !activeTab) {
        setActiveTab(brands[0].duong_dan);
    }

    // Fetch products for the currently selected brand
    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['products', 'brand', activeTab],
        queryFn: () => productService.getProducts({ brand: activeTab, limit: 8 }),
        enabled: !!activeTab,
    });

    if (brandsLoading) {
        return (
            <div className="w-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!brands || brands.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Minimalist Segmented Pill List */}
                <div className="flex justify-center mb-16 overflow-x-auto pb-4 hide-scrollbar">
                    <TabsList className="h-auto bg-slate-100/80 backdrop-blur-sm gap-2 p-2 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                        {brands.map((brand) => {
                            const isActive = activeTab === brand.duong_dan;
                            return (
                                <TabsTrigger
                                    key={brand.id}
                                    value={brand.duong_dan}
                                    className={`
                                        data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md
                                        px-8 py-3.5 rounded-full border-0 bg-transparent
                                        hover:bg-white/50 transition-all duration-300
                                        flex items-center gap-3 text-slate-500
                                    `}
                                >
                                    {brand.logo ? (
                                        <div className={`relative w-8 h-8 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-60'}`}>
                                            <Image
                                                src={brand.logo}
                                                alt={brand.ten}
                                                fill
                                                unoptimized
                                                className="object-contain"
                                                sizes="32px"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {brand.ten.charAt(0)}
                                        </div>
                                    )}
                                    <span className={`font-bold tracking-wide ${isActive ? 'text-[15px]' : 'text-sm'}`}>{brand.ten}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </div>

                {/* Tab Contents */}
                {brands.map((brand) => (
                    <TabsContent key={brand.id} value={brand.duong_dan} className="mt-0 focus-visible:outline-none">

                        {/* Minimalist Brand Typography Block */}
                        {brand.mo_ta && (
                            <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-slate-900 uppercase leading-snug">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-200 mr-2 -ml-6 select-none">"</span>
                                    {brand.mo_ta}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-200 ml-2 select-none">"</span>
                                </h3>
                            </div>
                        )}

                        {/* Brand Products Grid */}
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            {productsLoading && activeTab === brand.duong_dan ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex flex-col gap-3">
                                            <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-2xl" />
                                            <div className="w-2/3 h-5 bg-slate-100 animate-pulse rounded-md mt-2" />
                                            <div className="w-1/3 h-6 bg-slate-100 animate-pulse rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            ) : productsData?.data && productsData.data.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                                    {productsData.data.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
                                    <p className="text-slate-400 font-medium text-lg">Bộ sưu tập mới của {brand.ten} đang được chuẩn bị.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
