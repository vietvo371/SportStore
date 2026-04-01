'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        <div className="container mx-auto px-4 py-8 lg:py-12 flex items-center justify-center min-h-[85vh] relative">
            
            {/* Background pattern for the page */}
            <div className="fixed inset-0 z-0 bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

            {/* Floating Split Card */}
            <div className="flex flex-col lg:flex-row-reverse w-full max-w-[1100px] min-h-[650px] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100/80 bg-white relative z-10">
                
                {/* Right Side - Visual Banner */}
                <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-slate-950">
                    {/* Background Image */}
                <Image 
                    src="/images/register_banner.png" 
                    alt="Register Banner" 
                    fill 
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-[20s] ease-out select-none" 
                />
                
                {/* Cinematic Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30 z-10" />

                <div className="relative z-20 flex items-center justify-end gap-3 w-full">
                    <Link href="/" className="group flex items-center gap-3 select-none outline-none">
                        <span className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
                            SPORTSTORE
                        </span>
                        <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20 group-hover:-translate-y-1 transition-transform">
                            <Image src="/logo.png" alt="SportStore" fill sizes="48px" className="object-cover" />
                        </div>
                    </Link>
                </div>

                <div className="relative z-20 mb-10 max-w-[500px] lg:ml-auto text-right">
                    <h2 className="text-6xl font-black tracking-tighter text-white mb-6 leading-[1.05] drop-shadow-xl">
                        Bắt Đầu <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 via-cyan-400 to-blue-500">Hành Trình Mới.</span>
                    </h2>
                    <p className="text-[17px] text-slate-300 font-medium leading-relaxed ml-auto drop-shadow-md">
                        Tạo tài khoản ngay bây giờ để theo dõi đơn hàng dễ dàng, nhận thông báo về những bộ sưu tập mới nhất và vô vàn đặc quyền khác.
                    </p>
                </div>
            </div>

            {/* Left Side - Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center h-full min-h-[650px] p-6 sm:p-12 relative bg-white">

                {/* Mobile Logo Back Button */}
                <div className="absolute top-6 left-6 lg:hidden z-10">
                    <Link href="/" className="inline-flex items-center gap-2 outline-none">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
                            <Image src="/logo.png" alt="SportStore" fill sizes="40px" className="object-cover" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900">
                            SPORTSTORE
                        </span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-[440px] mx-auto bg-white rounded-[2rem] sm:p-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out mt-12 lg:mt-0">
                    
                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                            Tạo Tài Khoản
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-base font-medium">
                            Chào bạn! Hãy điền các thông tin của bạn vào form dưới đây.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMsg && (
                            <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="hoTen">
                                    Họ và Tên
                                </label>
                                <Input
                                    id="hoTen"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    required
                                    value={hoTen}
                                    onChange={(e) => setHoTen(e.target.value)}
                                    className="h-[52px] px-5 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">
                                    Địa chỉ Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-[52px] px-5 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-[52px] px-5 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="passwordConfirm">
                                        Xác nhận
                                    </label>
                                    <Input
                                        id="passwordConfirm"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="h-[52px] px-5 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-bold tracking-wide rounded-full bg-slate-950 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-all duration-200 mt-4"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? 'Đang khởi tạo...' : 'Đăng Ký Tài Khoản'}
                        </Button>
                    </form>

                    <div className="text-center text-[14px] text-slate-600 mt-8 font-medium">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="font-bold text-slate-950 hover:text-slate-700 underline underline-offset-4 decoration-2 decoration-slate-200 hover:decoration-slate-900 transition-all">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
