'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/ProductCard';
import { recommendationService } from '@/services/recommendation.service';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface RecommendationSectionProps {
    title?: string;
    subtitle?: string;
}

export const RecommendationSection = ({ 
    title = 'Gợi ý dành riêng cho bạn',
    subtitle = 'Dựa trên những sản phẩm bạn đã xem và sở thích của bạn'
}: RecommendationSectionProps) => {
    const { data: recommendations = [], isLoading } = useQuery({
        queryKey: ['products', 'recommendations'],
        queryFn: () => recommendationService.getRecommendations(),
    });

    if (!isLoading && recommendations.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {subtitle && (
                    <p className="text-muted-foreground mt-2 max-w-2xl px-4">
                        {subtitle}
                    </p>
                )}
            </div>

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
