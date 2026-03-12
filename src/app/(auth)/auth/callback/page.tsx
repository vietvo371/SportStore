'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Component tách riêng vì useSearchParams() bắt buộc cần Suspense
function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setStatus('error');
            setErrorMsg('Không nhận được mã xác thực từ Google.');
            return;
        }

        const handleCallback = async () => {
            try {
                const data = await authService.loginWithGoogle(code);
                setAuth(data.user, data.token);
                setStatus('success');

                setTimeout(() => {
                    if (data.user.vai_tro === 'quan_tri') {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                }, 1000);
            } catch (err: any) {
                setStatus('error');
                setErrorMsg(err?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
            }
        };

        handleCallback();
    }, [searchParams, setAuth, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center gap-6 max-w-sm w-full text-center">
                {status === 'loading' && (
                    <>
                        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Đang xác thực...</h2>
                            <p className="text-slate-500 text-sm mt-1">Đang kết nối với tài khoản Google của bạn</p>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Đăng nhập thành công!</h2>
                            <p className="text-slate-500 text-sm mt-1">Đang chuyển hướng...</p>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-rose-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Đăng nhập thất bại</h2>
                            <p className="text-slate-500 text-sm mt-1">{errorMsg}</p>
                        </div>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-2 text-sm font-semibold text-primary hover:underline"
                        >
                            Quay lại trang đăng nhập
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// Bắt buộc wrap Suspense vì useSearchParams() cần nó trong Next.js App Router
export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Đang tải...</p>
                </div>
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}
