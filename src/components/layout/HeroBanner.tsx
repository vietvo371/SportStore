'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { bannerService } from '@/services/banner.service';

export function HeroBanner() {
    const [api, setApi] = useState<CarouselApi>();

    const { data: banners = [], isLoading } = useQuery({
        queryKey: ['banners', 'home_main'],
        queryFn: () => bannerService.getBanners('home_main'),
    });

    // Auto-play logic
    useEffect(() => {
        if (!api) return;

        const intervalId = setInterval(() => {
            api.scrollNext();
        }, 5000); // 5 seconds interval

        return () => clearInterval(intervalId);
    }, [api]);

    if (isLoading) {
        return <div className="w-full h-[70vh] md:h-[85vh] bg-slate-100 animate-pulse" />;
    }

    if (banners.length === 0) {
        // Fallback if no banners from API
        return (
            <div className="w-full h-[70vh] md:h-[85vh] bg-slate-950 overflow-hidden relative flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter z-10 drop-shadow-2xl">
                    SPORTSTORE
                </h2>
                <p className="text-slate-400 mt-4 text-lg font-medium tracking-widest uppercase z-10">Premium Sportswear</p>
            </div>
        );
    }

    return (
        <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
                loop: true,
                align: "start",
            }}
        >
            <CarouselContent>
                {banners.map((banner) => (
                    <CarouselItem key={banner.id}>
                        <div className="relative w-full h-[70vh] md:h-[85vh]">
                            <Image
                                src={banner.hinh_anh}
                                alt={banner.tieu_de || 'SportStore Banner'}
                                fill
                                unoptimized
                                className="object-cover"
                                priority={banner.thu_tu === 1}
                            />

                            {/* Cinematic Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/10 z-10" />

                            {/* Content Overlay */}
                            {(banner.tieu_de || banner.mo_ta) && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-6 mt-20">
                                    {banner.tieu_de && (
                                        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-6 drop-shadow-2xl uppercase leading-[0.9] animate-in slide-in-from-bottom-8 fade-in duration-1000">
                                            {/* {banner.tieu_de} */}
                                        </h2>
                                    )}
                                    {banner.mo_ta && (
                                        <p className="text-lg sm:text-2xl md:text-3xl max-w-4xl font-medium tracking-tight text-slate-200 drop-shadow-xl animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
                                            {/* {banner.mo_ta} */}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Minimal Custom Arrows */}
            <div className="hidden md:block">
                <CarouselPrevious className="left-8 h-14 w-14 bg-white/10 hover:bg-white text-white hover:text-slate-900 border-0 backdrop-blur-md transition-all rounded-full" />
                <CarouselNext className="right-8 h-14 w-14 bg-white/10 hover:bg-white text-white hover:text-slate-900 border-0 backdrop-blur-md transition-all rounded-full" />
            </div>
        </Carousel>
    );
}
