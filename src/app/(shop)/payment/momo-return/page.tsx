'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

function MomoReturnContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { verifyMomoReturn, isVerifyingMomo } = useOrder();
    const [result, setResult] = useState<{ success: boolean; message: string; ma_don_hang?: string } | null>(null);
    const hasCalled = useRef(false);

    useEffect(() => {
        const verify = async () => {
             // 1. Chặn re-render hook nhiều lần
            if (hasCalled.current) return;
            hasCalled.current = true;

            const params: Record<string, string> = {};
            searchParams.forEach((value, key) => {
                params[key] = value;
            });

            const resultCode = params.resultCode;
            const extraMessage = params.message;
            const originalOrderId = params.orderId ? params.orderId.split('_')[0] : 'Không rõ';

            // 2. Chặn lỗi từ cổng MoMo (Ví dụ resultCode 1006 nghĩa là từ chối)
            if (resultCode && resultCode !== '0') {
               setResult({
                    success: false,
                    message: extraMessage || 'Giao dịch bị từ chối/hủy bỏ bởi người dùng.',
                    ma_don_hang: originalOrderId
                });
                toast.error(extraMessage || "Thanh toán thất bại");
                return; // Dừng, không cần gọi lên Backend xác thực chữ ký mất công
            }

            // 3. Gọi Backend xác minh chữ ký (resultCode == 0)
            try {
                const res: any = await verifyMomoReturn(params);
                setResult({
                    success: true,
                    message: res.message || 'Thanh toán MoMo thành công!',
                    ma_don_hang: originalOrderId
                });
            } catch (error: any) {
                setResult({
                    success: false,
                    message: error?.message || 'Giao dịch không thành công hoặc chữ ký không hợp lệ.',
                    ma_don_hang: originalOrderId
                });
            }
        };

        if (searchParams.get('signature')) {
            verify();
        } else {
            router.push('/');
        }
    }, [searchParams, verifyMomoReturn, router]);

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]">
            <AnimatePresence mode="wait">
                {isVerifyingMomo || !result ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="text-center space-y-4"
                    >
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                        <h2 className="text-2xl font-bold text-slate-800">Đang xác thực giao dịch MoMo...</h2>
                        <p className="text-muted-foreground">Vui lòng không tắt trình duyệt hoặc nhấn quay lại.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-lg"
                    >
                        <Card className={`border-2 ${result.success ? 'border-emerald-100 shadow-emerald-100/50' : 'border-red-100 shadow-red-100/50'} shadow-2xl rounded-3xl overflow-hidden`}>
                            <div className={`h-2 ${result.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <CardHeader className="text-center pt-10 pb-6">
                                <div className="mx-auto mb-6 relative">
                                    {result.success ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        >
                                            <div className="bg-emerald-100 rounded-full p-4 inline-block">
                                                <CheckCircle2 className="h-16 w-16 text-emerald-600" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        >
                                            <div className="bg-red-100 rounded-full p-4 inline-block">
                                                <XCircle className="h-16 w-16 text-red-600" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                <CardTitle className={`text-3xl font-extrabold ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {result.success ? 'Thanh Toán MoMo Thành Công!' : 'Thanh Toán MoMo Thất Bại'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-10 space-y-8">
                                <div className="text-center space-y-2">
                                    <p className="text-slate-600 font-medium">
                                        {result.message}
                                    </p>
                                    {result.ma_don_hang && (
                                        <div className="inline-block bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Mã đơn hàng: {result.ma_don_hang}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <Link href="/profile/orders" className="w-full">
                                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50">
                                            <ShoppingBag className="mr-2 h-5 w-5" />
                                            Lịch sử đơn hàng
                                        </Button>
                                    </Link>
                                    <Link href="/" className="w-full">
                                        <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group">
                                            Tiếp tục mua sắm
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function MomoReturnPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <MomoReturnContent />
        </Suspense>
    );
}
