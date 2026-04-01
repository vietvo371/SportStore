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
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const registerMutation = useMutation({
        mutationFn: () => authService.register({
            ho_va_ten: hoTen,
            email,
            mat_khau: password,
            mat_khau_confirmation: passwordConfirm
        }),
        onSuccess: (data) => {
            setRegisteredEmail(email);
            setTempToken(data.token);
            setIsSuccess(true);
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

    const handleResend = async () => {
        if (!tempToken) return;
        setResendLoading(true);
        try {
            await authService.resendVerificationEmail(tempToken);
            import('sonner').then(({ toast }) => toast.success('Đã gửi lại email xác nhận!'));
        } catch (error: any) {
            import('sonner').then(({ toast }) => toast.error(error.message || 'Gửi lại thất bại.'));
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Kiểm tra họ tên ít nhất 2 từ
        const nameRegex = /^[\p{L}]+(?:\s+[\p{L}]+)+$/u;
        if (!nameRegex.test(hoTen.trim())) {
            setErrorMsg('Vui lòng nhập đầy đủ cả họ và tên (ít nhất 2 từ).');
            return;
        }

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

                    <div className="relative z-20 flex items-center justify-end w-full px-4">
                        <Link href="/" className="group flex items-center select-none outline-none">
                            <div className="relative w-52 h-24 overflow-hidden transition-transform group-hover:scale-105">
                                <Image src="/sportstore-logo.png" alt="SportStore" fill className="object-contain" sizes="208px" />
                            </div>
                        </Link>
                    </div>

                    <div className="relative z-20 mb-10 max-w-[500px] lg:ml-auto text-right">
                        <h2 className="text-6xl font-black tracking-tighter text-white mb-6 leading-[1.05] drop-shadow-xl">
                            Gia Nhập <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 via-cyan-400 to-blue-500">SportStore.</span>
                        </h2>
                        <p className="text-[17px] text-slate-300 font-medium leading-relaxed ml-auto drop-shadow-md">
                            Đăng ký tài khoản để nhận thông báo về bộ sưu tập mới nhất, ưu đãi độc quyền và trải nghiệm dịch vụ chăm sóc khách hàng chuyên nghiệp.
                        </p>
                    </div>
                </div>

                {/* Left Side - Form Container */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center h-full min-h-[650px] p-6 sm:p-12 relative bg-white">

                    {/* Mobile Logo Back Button */}
                    <div className="absolute top-6 left-6 lg:hidden z-10">
                        <Link href="/" className="inline-flex items-center outline-none">
                            <div className="relative w-32 h-15 overflow-hidden">
                                <Image src="/sportstore-logo.png" alt="SportStore" fill className="object-contain" sizes="128px" />
                            </div>
                        </Link>
                    </div>

                    {/* Content Area */}
                    <div className="w-full max-w-[440px] mx-auto z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out mt-12 lg:mt-0">
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 mb-4">Kiểm Tra Email!</h1>
                                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                                    Chúng tôi đã gửi một link xác thực đến <span className="text-slate-900 font-bold">{registeredEmail}</span>.
                                    Vui lòng kiểm tra hộp thư (và cả thư rác) để hoàn tất đăng ký.
                                </p>
                                <div className="space-y-4">
                                    <Button
                                        onClick={() => router.push('/login')}
                                        className="w-full h-14 text-base font-bold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                                    >
                                        Quay lại Đăng nhập
                                    </Button>
                                    <p className="text-sm text-slate-400 font-medium">
                                        Không nhận được email?{' '}
                                        <button
                                            disabled={resendLoading}
                                            onClick={handleResend}
                                            className="text-slate-900 font-bold hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                                        >
                                            {resendLoading && <div className="h-2 w-2 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />}
                                            {resendLoading ? 'Đang gửi...' : 'Gửi lại'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
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
                                                autoComplete="off"
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="password">
                                                    Mật khẩu
                                                </label>
                                                <div className="relative group/pass">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="h-[52px] px-5 pr-12 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
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
                                                    Xác nhận
                                                </label>
                                                <div className="relative group/pass">
                                                    <Input
                                                        id="passwordConfirm"
                                                        type={showPasswordConfirm ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        required
                                                        value={passwordConfirm}
                                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                                        className="h-[52px] px-5 pr-12 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all placeholder:text-slate-400"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all outline-none"
                                                    >
                                                        {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
