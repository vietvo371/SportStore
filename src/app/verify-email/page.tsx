'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get('status');
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        setResending(true);
        try {
            await authService.resendVerificationEmail();
            toast.success('Đã gửi lại email xác thực!');
        } catch {
            toast.error('Gửi lại thất bại. Vui lòng thử lại sau.');
        } finally {
            setResending(false);
        }
    };

    const configs: Record<string, {
        icon: React.ReactNode;
        title: string;
        description: string;
        color: string;
        action?: React.ReactNode;
    }> = {
        success: {
            icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" />,
            title: 'Email đã được xác thực!',
            description: 'Tài khoản của bạn đã được xác thực thành công. Bạn có thể sử dụng đầy đủ các tính năng của SportStore.',
            color: 'border-emerald-100 bg-emerald-50/50',
            action: (
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                    Về trang chủ <ArrowRight className="w-4 h-4" />
                </button>
            )
        },
        already_verified: {
            icon: <CheckCircle2 className="w-16 h-16 text-blue-400" />,
            title: 'Đã xác thực rồi!',
            description: 'Email của bạn đã được xác thực trước đó. Không cần làm lại.',
            color: 'border-blue-100 bg-blue-50/50',
            action: (
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                    Về trang chủ <ArrowRight className="w-4 h-4" />
                </button>
            )
        },
        expired: {
            icon: <Clock className="w-16 h-16 text-amber-500" />,
            title: 'Link đã hết hạn',
            description: 'Link xác thực này đã hết hạn (sau 60 phút). Vui lòng yêu cầu gửi lại một link mới.',
            color: 'border-amber-100 bg-amber-50/50',
            action: (
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                    {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {resending ? 'Đang gửi...' : 'Gửi lại link'}
                </button>
            )
        },
        error: {
            icon: <XCircle className="w-16 h-16 text-red-500" />,
            title: 'Link không hợp lệ',
            description: 'Link xác thực không đúng hoặc đã bị thay đổi. Vui lòng yêu cầu gửi lại.',
            color: 'border-red-100 bg-red-50/50',
            action: (
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                    {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {resending ? 'Đang gửi...' : 'Gửi lại link'}
                </button>
            )
        },
    };

    const current = configs[status ?? ''] ?? {
        icon: <Clock className="w-16 h-16 text-gray-400" />,
        title: 'Đang xác thực...',
        description: 'Vui lòng chờ trong giây lát.',
        color: 'border-gray-100 bg-gray-50/50',
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <div className={`w-full max-w-md bg-white rounded-3xl border-2 shadow-sm p-10 text-center ${current.color}`}>
                {/* Logo */}
                <div className="mb-8">
                    <a href="/" className="text-2xl font-black tracking-tight text-slate-900">
                        SPORT<span className="text-orange-500">STORE</span>
                    </a>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    {current.icon}
                </div>

                {/* Content */}
                <h1 className="text-2xl font-extrabold text-slate-900 mb-3">{current.title}</h1>
                <p className="text-slate-500 leading-relaxed mb-8">{current.description}</p>

                {/* Action */}
                {current.action && (
                    <div className="flex justify-center">{current.action}</div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
