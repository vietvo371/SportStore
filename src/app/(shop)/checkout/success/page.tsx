'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('order');

    return (
        <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 text-center border border-slate-100">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 text-emerald-500 mb-8 mx-auto shadow-inner shadow-emerald-200">
                <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Đặt hàng thành công!
            </h1>

            <p className="text-slate-500 mb-8 leading-relaxed">
                Cảm ơn bạn đã mua sắm tại SportStore. Chúc bạn có những trải nghiệm tuyệt vời với sản phẩm của chúng tôi.
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Thông tin đơn hàng</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                        <span className="text-slate-500">Mã đơn hàng</span>
                        <span className="font-mono font-bold text-slate-900 text-lg bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200">
                            {orderCode || '#ERROR'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Trạng thái</span>
                        <span className="inline-flex space-x-1.5 items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Chờ xác nhận</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold" size="lg">
                        <Home className="mr-2 h-4 w-4" />
                        Trang Chủ
                    </Button>
                </Link>
                {orderCode ? (
                    <Link href={`/profile/orders/${orderCode}`} className="flex-1">
                        <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold" size="lg">
                            <Package className="mr-2 h-4 w-4" />
                            Theo dõi đơn
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Link href="/profile/orders" className="flex-1">
                        <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold" size="lg">
                            <Package className="mr-2 h-4 w-4" />
                            Lịch sử đơn
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] sm:top-0 left-[-10%] sm:left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] sm:bottom-0 right-[-10%] sm:right-0 w-64 md:w-96 h-64 md:h-96 bg-emerald-400/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Đang tải thông tin đơn...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
