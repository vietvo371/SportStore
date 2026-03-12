'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const loginMutation = useMutation({
        mutationFn: () => authService.login({ email, mat_khau: password }),
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            if (data.user.vai_tro === 'quan_tri') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        },
        onError: (error: any) => {
            if (error?.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                setErrorMsg(firstError[0] || 'Dữ liệu không hợp lệ');
            } else {
                setErrorMsg(error?.message || 'Email hoặc mật khẩu không chính xác.');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        loginMutation.mutate();
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 flex items-center justify-center min-h-[85vh]">
            <div className="flex flex-col lg:flex-row w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 bg-white">

                {/* Left Side - Visual Banner */}
                <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative p-12 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/40 z-10 opacity-90" />

                    {/* Decorative abstract elements */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/20 blur-3xl z-10" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl z-10" />

                    <div className="absolute inset-0 z-0">
                        {/* Optionally use a real sports background if available, fallback to a cool pattern or placeholder */}
                        <div className="w-full h-full bg-[url('/placeholder.png')] bg-cover bg-center opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
                    </div>

                    <div className="relative z-20 text-white flex flex-col justify-between h-full w-full">
                        <div>
                            <Link href="/">
                                <span className="text-2xl font-black tracking-tighter cursor-pointer hover:text-primary transition-colors">
                                    SPORTSTORE
                                </span>
                            </Link>
                        </div>
                        <div className="mb-12">
                            <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                                Vượt Qua<br />
                                Khởi Đầu Mới.
                            </h2>
                            <p className="text-lg text-slate-300 font-light max-w-sm leading-relaxed">
                                Nâng tầm phong cách thể thao của bạn. Đăng nhập để nhận ưu đãi và mua sắm dễ dàng hơn.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Container */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto space-y-8">
                        <div className="text-center lg:text-left space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Chào Mừng Trở Lại
                            </h1>
                            <p className="text-muted-foreground">
                                Vui lòng đăng nhập vào tài khoản của bạn.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errorMsg && (
                                <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 px-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                            Mật khẩu
                                        </label>
                                        <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 px-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? 'Đang xác thực...' : 'Đăng Nhập'}
                            </Button>
                        </form>

                        <div className="relative flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest shrink-0">hoặc</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <GoogleLoginButton />

                        <div className="text-center text-sm text-slate-600">
                            Bạn chưa có tài khoản?{' '}
                            <Link href="/register" className="font-bold text-primary hover:underline transition-all">
                                Hãy đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function GoogleLoginButton() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const url = await authService.getGoogleRedirectUrl();
            window.location.href = url;
        } catch {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? (
                <svg className="h-4 w-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            )}
            {loading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
        </button>
    );
}
