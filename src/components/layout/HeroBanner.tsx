'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { bannerService } from '@/services/banner.service';

export function HeroBanner() {
    const { data: banners = [], isLoading } = useQuery({
        queryKey: ['banners', 'home_main'],
        queryFn: () => bannerService.getBanners('home_main'),
    });

    if (isLoading) {
        return <div className="w-full h-[300px] md:h-[500px] bg-slate-100 animate-pulse rounded-xl" />;
    }

    if (banners.length === 0) {
        // Fallback if no banners from API
        return (
            <div className="w-full h-[300px] md:h-[500px] bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white tracking-widest z-10">SPORTSTORE</h2>
            </div>
        );
    }

    return (
        <Carousel className="w-full rounded-xl overflow-hidden">
            <CarouselContent>
                {banners.map((banner) => (
                    <CarouselItem key={banner.id}>
                        <div className="relative w-full h-[300px] md:h-[500px]">
                            <Image
                                src={banner.hinh_anh}
                                alt={banner.tieu_de || 'Banner'}
                                fill
                                unoptimized
                                className="object-cover"
                                priority={banner.thu_tu === 1}
                            />
                            {/* {(banner.tieu_de || banner.mo_ta) && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center p-4">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.tieu_de}</h2>
                                    {banner.mo_ta && <p className="text-lg md:text-xl max-w-2xl">{banner.mo_ta}</p>}
                                </div>
                            )} */}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
    );
}
