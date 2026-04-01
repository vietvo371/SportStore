'use client';

import { useState, Suspense } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: (data: any) => authService.resetPassword(data),
        onSuccess: () => {
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        },
        onError: (error: any) => {
            if (error?.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                setErrorMsg(firstError[0] || 'Dữ liệu không hợp lệ');
            } else {
                setErrorMsg(error?.message || 'Token không hợp lệ hoặc đã hết hạn.');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!token || !email) {
            setErrorMsg('Thông tin xác thực thiếu hoặc không hợp lệ.');
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
            return;
        }

        mutation.mutate({
            token,
            email,
            password,
            password_confirmation: passwordConfirm,
        });
    };

    if (!token || !email) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Lock className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Lỗi Xác Thực!</h1>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    Link đặt lại mật khẩu của bạn thiếu thông tin xác thực cần thiết. Vui lòng kiểm tra lại email hoặc yêu cầu gửi link mới.
                </p>
                <Button asChild className="w-full h-14 rounded-full bg-slate-900">
                    <Link href="/forgot-password">Yêu Cầu Link Mới</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {isSuccess ? (
                <div className="text-center py-4">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4">Thành Công!</h1>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        Mật khẩu của bạn đã được cập nhật thành công. Hệ thống sẽ tự động chuyển hướng về trang đăng nhập sau vài giây.
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-2 mb-10 text-center sm:text-left">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Đặt Lại Mật Khẩu
                        </h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Vui lòng nhập mật khẩu mới cho tài khoản <span className="text-slate-900 font-bold">{email}</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errorMsg && (
                            <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="password">
                                    Mật khẩu mới
                                </label>
                                <div className="relative group/pass">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-[56px] px-5 pr-12 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="passwordConfirm">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative group/pass">
                                    <Input
                                        id="passwordConfirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="h-[56px] px-5 pr-12 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all outline-none"
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-bold tracking-wide rounded-full bg-slate-950 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-all duration-200 mt-2"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 flex items-center justify-center min-h-[85vh] relative">
            <div className="fixed inset-0 z-0 bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

            <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/80 p-8 sm:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Suspense fallback={<div className="flex justify-center p-12"><div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center">
                    <div className="relative w-40 h-18">
                        <Image src="/sportstore-logo.png" alt="SportStore" fill className="object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
}
