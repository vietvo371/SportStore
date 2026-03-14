'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/ProductCard';
import { recommendationService } from '@/services/recommendation.service';

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl" />
                            <div className="w-2/3 h-4 bg-slate-100 animate-pulse rounded mt-2" />
                            <div className="w-1/3 h-5 bg-slate-100 animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {recommendations.slice(0, 8).map((product) => (
                        <ProductCard key={`rec-${product.id}`} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};
