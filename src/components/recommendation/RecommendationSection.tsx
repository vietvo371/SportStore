'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/ProductCard';
import { recommendationService } from '@/services/recommendation.service';
import { useState, useEffect } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

interface RecommendationSectionProps {
    title?: string;
    subtitle?: string;
    productId?: number; // Nếu có → lấy sản phẩm tương tự; không có → gợi ý cá nhân hóa
}

export const RecommendationSection = ({ 
    title,
    subtitle,
    productId
}: RecommendationSectionProps) => {
    const [api, setApi] = useState<CarouselApi>();

    const displayTitle = typeof title === 'string' ? title : (productId ? 'Sản phẩm tương tự' : 'Gợi ý dành riêng cho bạn');
    const displaySubtitle = typeof subtitle === 'string' ? subtitle : (productId 
        ? 'Những sản phẩm liên quan bạn có thể quan tâm'
        : 'Dựa trên những sản phẩm bạn đã xem và sở thích của bạn');

    const { data: recommendations = [], isLoading } = useQuery({
        queryKey: productId 
            ? ['products', 'related', productId] 
            : ['products', 'recommendations'],
        queryFn: () => productId 
            ? recommendationService.getRelatedProducts(productId)
            : recommendationService.getRecommendations(),
    });

    // Auto-play logic
    useEffect(() => {
        if (!api) return;

        const intervalId = setInterval(() => {
            api.scrollNext();
        }, 4000); // 4 seconds interval for recommendations

        return () => clearInterval(intervalId);
    }, [api]);

    if (!isLoading && recommendations.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {(displayTitle || displaySubtitle) && (
                <div className="flex flex-col items-center justify-center mb-8 text-center">
                    {displayTitle && <h2 className="text-3xl font-bold tracking-tight text-slate-900">{displayTitle}</h2>}
                    {displaySubtitle && (
                        <p className="text-muted-foreground mt-2 max-w-2xl px-4">
                            {displaySubtitle}
                        </p>
                    )}
                </div>
            )}

            {isLoading ? (
                <div className="flex gap-4 sm:gap-6 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col gap-2 w-[calc(50%-8px)] md:w-[calc(25%-18px)] shrink-0">
                            <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl" />
                            <div className="w-2/3 h-4 bg-slate-100 animate-pulse rounded mt-2" />
                            <div className="w-1/3 h-5 bg-slate-100 animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative px-0 md:px-12">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 sm:-ml-6">
                            {recommendations.map((product) => (
                                <CarouselItem key={`rec-${product.id}`} className="pl-4 sm:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <ProductCard product={product} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 opacity-70 hover:opacity-100 shadow-sm transition-opacity" />
                        <CarouselNext className="hidden md:flex -right-4 lg:-right-12 opacity-70 hover:opacity-100 shadow-sm transition-opacity" />
                    </Carousel>
                </div>
            )}
        </div>
    );
};
