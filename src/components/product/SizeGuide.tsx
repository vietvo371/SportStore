'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Table, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SizeGuideProps {
    loai: 'ao' | 'quan' | 'giay';
    thuong_hieu_id?: number;
    onSelectSize?: (size: string) => void;
}

export function SizeGuide({ loai, thuong_hieu_id, onSelectSize }: SizeGuideProps) {
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [footLength, setFootLength] = useState<string>('');
    const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

    const { data: sizeCharts, isLoading } = useQuery({
        queryKey: ['size-charts', loai, thuong_hieu_id],
        queryFn: () => productService.getSizeCharts({ loai, thuong_hieu_id }),
    });

    const handleRecommend = () => {
        if (!sizeCharts || sizeCharts.length === 0) return;

        let suggestion: string | null = null;

        if (loai === 'giay') {
            const length = parseFloat(footLength);
            if (isNaN(length)) return;

            // Tìm size phù hợp với chiều dài chân
            const match = sizeCharts.find((s: any) => 
                length >= s.chieu_dai_chan_min && 
                (!s.chieu_dai_chan_max || length <= s.chieu_dai_chan_max)
            );
            suggestion = match ? match.ten_size : null;
        } else {
            const h = parseFloat(height);
            const w = parseFloat(weight);
            if (isNaN(h) || isNaN(w)) return;

            // Thuật toán: Tìm size fit chiều cao và size fit cân nặng, lấy size lớn nhất để an toàn
            const heightMatch = sizeCharts.filter((s: any) => 
                h >= s.chieu_cao_min && (!s.chieu_cao_max || h <= s.chieu_cao_max)
            );
            const weightMatch = sizeCharts.filter((s: any) => 
                w >= s.can_nang_min && (!s.can_nang_max || w <= s.can_nang_max)
            );

            if (heightMatch.length > 0 && weightMatch.length > 0) {
                // Lấy size có trọng số lớn hơn (ví dụ: nếu chiều cao là L mà cân nặng là XL, chọn XL)
                // Giả định thứ tự trong bảng là tăng dần
                const hSize = heightMatch[heightMatch.length - 1];
                const wSize = weightMatch[weightMatch.length - 1];
                
                // So sánh theo index trong mảng sizeCharts
                const hIdx = sizeCharts.findIndex((s: any) => s.id === hSize.id);
                const wIdx = sizeCharts.findIndex((s: any) => s.id === wSize.id);
                
                suggestion = sizeCharts[Math.max(hIdx, wIdx)].ten_size;
            }
        }

        setRecommendedSize(suggestion);
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-4 animate-pulse">
                <div className="h-10 w-full bg-slate-100 rounded-xl" />
                <div className="h-64 w-full bg-slate-100 rounded-xl" />
            </div>
        );
    }

    return (
        <Tabs defaultValue="calculator" className="w-full">
            <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-xl">
                    <TabsTrigger value="calculator" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-2">
                        <Calculator className="w-4 h-4" />
                        Gợi ý size
                    </TabsTrigger>
                    <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-2">
                        <Table className="w-4 h-4" />
                        Bảng quy chuẩn
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="calculator" className="p-6 space-y-6 focus-visible:outline-none outline-none">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-700 leading-relaxed">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>Nhập thông tin cơ thể của bạn để chúng tôi tính toán kích cỡ phù hợp nhất dựa trên phom dáng của sản phẩm này.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {loai === 'giay' ? (
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="footLength">Chiều dài bàn chân (mm)</Label>
                            <Input 
                                id="footLength" 
                                type="number" 
                                placeholder="Ví dụ: 260" 
                                value={footLength}
                                onChange={(e) => setFootLength(e.target.value)}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="height">Chiều cao (cm)</Label>
                                <Input 
                                    id="height" 
                                    type="number" 
                                    placeholder="Ví dụ: 170" 
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight">Cân nặng (kg)</Label>
                                <Input 
                                    id="weight" 
                                    type="number" 
                                    placeholder="Ví dụ: 65" 
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                        </>
                    )}
                </div>

                <Button 
                    onClick={handleRecommend} 
                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all active:scale-[0.98]"
                >
                    Tính toán kích cỡ
                </Button>

                {recommendedSize ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center">
                            <div className="bg-emerald-500 p-2 rounded-full text-white">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-emerald-800 font-medium mb-1">Kích cỡ gợi ý cho bạn:</p>
                            <h3 className="text-4xl font-extrabold text-emerald-600">Size {recommendedSize}</h3>
                        </div>
                        <p className="text-xs text-emerald-600/80 italic">
                            * Gợi ý dựa trên thông số chuẩn của hãng. Nếu bạn thích mặc rộng, hãy cân nhắc tăng 1 size.
                        </p>
                    </div>
                ) : (
                    recommendedSize === null && (height || footLength) && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center text-amber-700 text-sm">
                            Rất tiếc, chúng tôi chưa tìm thấy size phù hợp với thông số này.
                        </div>
                    )
                )}
            </TabsContent>

            <TabsContent value="table" className="p-6 focus-visible:outline-none outline-none">
                <div className="border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                            <tr>
                                <th className="px-4 py-3">Kích cỡ</th>
                                {loai === 'giay' ? (
                                    <th className="px-4 py-3">Dài chân (mm)</th>
                                ) : (
                                    <>
                                        <th className="px-4 py-3">Cao (cm)</th>
                                        <th className="px-4 py-3">Nặng (kg)</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-600">
                            {sizeCharts?.map((s: any) => (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-900">{s.ten_size}</td>
                                    {loai === 'giay' ? (
                                        <td className="px-4 py-3">
                                            {s.chieu_dai_chan_min} - {s.chieu_dai_chan_max || '++'}
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3">{s.chieu_cao_min} - {s.chieu_cao_max || '++'}</td>
                                            <td className="px-4 py-3">{s.can_nang_min} - {s.can_nang_max || '++'}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {!sizeCharts?.length && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">
                                        Chưa có dữ liệu bảng size cho phân loại này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </TabsContent>
        </Tabs>
    );
}
