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

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const registerMutation = useMutation({
        mutationFn: () => authService.register({
            ho_va_ten: hoTen,
            email,
            mat_khau: password,
            mat_khau_confirmation: passwordConfirm
        }),
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            router.push('/');
        },
        onError: (error: any) => {
            if (error?.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                setErrorMsg(firstError[0] || 'Dữ liệu không hợp lệ');
            } else {
                setErrorMsg(error?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (password !== passwordConfirm) {
            setErrorMsg('Mật khẩu xác nhận không khớp.');
            return;
        }
        registerMutation.mutate();
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 flex items-center justify-center min-h-[85vh]">
            <div className="flex flex-col lg:flex-row-reverse w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 bg-white">

                {/* Visual Banner (Right side for Register to differentiate from Login) */}
                <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative p-12 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-primary/40 z-10 opacity-90" />

                    {/* Decorative abstract elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/20 blur-3xl z-10" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl z-10" />

                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full bg-[url('/placeholder.png')] bg-cover bg-center opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
                    </div>

                    <div className="relative z-20 text-white flex flex-col justify-between h-full w-full items-end text-right">
                        <div>
                            <Link href="/">
                                <span className="text-2xl font-black tracking-tighter cursor-pointer hover:text-primary transition-colors">
                                    SPORTSTORE
                                </span>
                            </Link>
                        </div>
                        <div className="mb-12">
                            <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                                Bắt Đầu<br />
                                Hành Trình Mới.
                            </h2>
                            <p className="text-lg text-slate-300 font-light max-w-sm ml-auto leading-relaxed">
                                Đăng ký ngay để nhận thông báo khuyến mãi, quản lý đơn hàng và trải nghiệm mua sắm tuyệt vời.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        <div className="text-center lg:text-left space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Tạo Tài Khoản
                            </h1>
                            <p className="text-muted-foreground">
                                Hãy điền thông tin bên dưới để đăng ký.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errorMsg && (
                                <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="hoTen">
                                        Họ và Tên
                                    </label>
                                    <Input
                                        id="hoTen"
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        required
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        className="h-11 px-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 px-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                            Mật khẩu
                                        </label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 px-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700" htmlFor="passwordConfirm">
                                            Xác nhận
                                        </label>
                                        <Input
                                            id="passwordConfirm"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            className="h-11 px-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all mt-4"
                                disabled={registerMutation.isPending}
                            >
                                {registerMutation.isPending ? 'Đang tạo...' : 'Đăng Ký Tài Khoản'}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-slate-600 pt-2">
                            Bạn đã có tài khoản?{' '}
                            <Link href="/login" className="font-bold text-primary hover:underline transition-all">
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
