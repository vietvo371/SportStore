'use client';

import { useQuery } from '@tanstack/react-query';
import { couponService } from '@/services/coupon.service';
import { Ticket, Copy, Check, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function AvailableCoupons({ onApply }: { onApply?: (code: string) => void }) {
    const { data: coupons, isLoading } = useQuery({
        queryKey: ['available-coupons'],
        queryFn: couponService.getAvailableCoupons,
    });

    const [copiedCode, setCopiedCode] = useState<string | null>(null);


    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Đã sao chép mã ${code}`);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="py-4 px-2 space-y-3">
                <div className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>
                <div className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>
            </div>
        );
    }

    if (!coupons || coupons.length === 0) {
        return null;
    }

    const visibleCoupons = coupons;

    return (
        <div className="space-y-3 mt-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <Ticket className="h-4 w-4 text-rose-600" />
                Mã giảm giá dành cho bạn
            </h4>
            <div className={`space-y-3 ${coupons.length > 2 ? 'max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-transparent' : ''}`}>
                {visibleCoupons.map((coupon: any) => (
                    <div 
                        key={coupon.id} 
                        className="relative flex rounded-xl border border-rose-200 bg-rose-50/50 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-rose-300 group"
                    >
                        {/* Cutout effect */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-rose-200"></div>
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-rose-200"></div>
                        
                        {/* Left side: Discount amount */}
                        <div className="w-1/3 bg-gradient-to-br from-rose-500 to-red-600 text-white p-3 flex flex-col justify-center items-center border-r border-dashed border-white/40">
                            <span className="text-lg font-black leading-none drop-shadow-sm">
                                {coupon.loai_giam === 'phan_tram' ? `${coupon.gia_tri}%` : formatCurrency(coupon.gia_tri)}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider opacity-90 mt-1 text-center leading-tight">Giảm Giá</span>
                        </div>
                        
                        {/* Right side: Details */}
                        <div className="w-2/3 p-3 flex flex-col justify-center pl-4 bg-white relative">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-900 border border-slate-200 px-2 py-0.5 rounded-lg text-xs tracking-wider uppercase bg-slate-50">
                                    {coupon.ma_code}
                                </span>
                                {coupon.giam_toi_da > 0 && coupon.loai_giam === 'phan_tram' && (
                                    <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-200 bg-emerald-50 px-1 py-0 h-4">
                                        Max {formatCurrency(coupon.giam_toi_da)}
                                    </Badge>
                                )}
                            </div>
                            
                            <p className="text-xs text-slate-500 font-medium line-clamp-1">
                                Đơn từ {formatCurrency(coupon.gia_tri_don_hang_min || 0)}
                            </p>
                            
                            {coupon.het_han_luc && (
                                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    HSD: {formatDate(coupon.het_han_luc)}
                                </p>
                            )}

                            <button
                                onClick={() => onApply ? onApply(coupon.ma_code) : handleCopy(coupon.ma_code)}
                                className="absolute bottom-3 right-3 text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors bg-rose-50 px-2 py-1 rounded-md"
                            >
                                {copiedCode === coupon.ma_code ? (
                                    <><Check className="h-3.5 w-3.5" /> Chép</>
                                ) : onApply ? (
                                    'Dùng'
                                ) : (
                                    <><Copy className="h-3.5 w-3.5" /> Lấy</>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
                

            </div>
        </div>
    );
}
