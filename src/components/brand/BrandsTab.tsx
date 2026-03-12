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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!brands || brands.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Tabs List */}
                <div className="flex justify-center mb-10 overflow-x-auto pb-4 hide-scrollbar">
                    <TabsList className="h-auto bg-transparent gap-4 sm:gap-6 p-1">
                        {brands.map((brand) => (
                            <TabsTrigger
                                key={brand.id}
                                value={brand.duong_dan}
                                className={`
                                    data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-sm
                                    px-6 py-4 rounded-xl border-2 border-transparent bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] 
                                    hover:shadow-[0_4px_15px_rgba(0,0,0,0.06)] hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300
                                    flex flex-col items-center gap-3 min-w-[170px] justify-center text-slate-500
                                `}
                            >
                                {brand.logo ? (
                                    <div className="relative w-32 h-12 flex items-center justify-center">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.ten}
                                            fill
                                            unoptimized
                                            className="object-contain"
                                            sizes="128px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl">
                                        {brand.ten.charAt(0)}
                                    </div>
                                )}
                                <span className="font-bold text-sm tracking-wide">{brand.ten}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Tab Contents */}
                {brands.map((brand) => (
                    <TabsContent key={brand.id} value={brand.duong_dan} className="mt-0 focus-visible:outline-none">

                        {/* Brand Description Block */}
                        {brand.mo_ta && (
                            <div className="max-w-3xl mx-auto text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-muted-foreground italic text-lg shadow-sm bg-white border border-slate-100 py-4 px-6 rounded-2xl relative inline-block">
                                    <span className="absolute -top-3 -left-2 text-4xl text-primary/20 font-serif">"</span>
                                    {brand.mo_ta}
                                    <span className="absolute -bottom-5 -right-2 text-4xl text-primary/20 font-serif">"</span>
                                </p>
                            </div>
                        )}

                        {/* Brand Products Grid */}
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            {productsLoading && activeTab === brand.duong_dan ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl" />
                                            <div className="w-2/3 h-4 bg-slate-100 animate-pulse rounded mt-2" />
                                            <div className="w-1/3 h-5 bg-slate-100 animate-pulse rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : productsData?.data && productsData.data.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                                    {productsData.data.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-muted-foreground">Đang cập nhật sản phẩm mới cho thương hiệu này.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
