'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [unverifiedToken, setUnverifiedToken] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useMutation({
        mutationFn: () => authService.login({ email, mat_khau: password }),
        onSuccess: (data) => {
            if (!data.user.xac_thuc_email_luc) {
                setErrorMsg('Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.');
                setUnverifiedToken(data.token);
                return;
            }
            setAuth(data.user, data.token);
            if (data.user.vai_tro === 'quan_tri') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        },
        onError: (error: any) => {
            setUnverifiedToken(null);
            if (error?.errors) {
                const firstError = Object.values(error.errors)[0] as string[];
                setErrorMsg(firstError[0] || 'Dữ liệu không hợp lệ');
            } else {
                setErrorMsg(error?.message || 'Email hoặc mật khẩu không chính xác.');
            }
        },
    });

    const handleResend = async () => {
        if (!unverifiedToken) return;
        setResendLoading(true);
        try {
            await authService.resendVerificationEmail(unverifiedToken);
            import('sonner').then(({ toast }) => toast.success('Đã gửi lại email xác thực thành công!'));
        } catch (error: any) {
            import('sonner').then(({ toast }) => toast.error(error.message || 'Gửi lại thất bại. Vui lòng thử lại sau.'));
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setUnverifiedToken(null);
        loginMutation.mutate();
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 flex items-center justify-center min-h-[85vh] relative">
            
            {/* Background pattern for the page */}
            <div className="fixed inset-0 z-0 bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

            {/* Floating Split Card */}
            <div className="flex flex-col lg:flex-row w-full max-w-[1100px] min-h-[650px] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100/80 bg-white relative z-10">
                
                {/* Left Side - Visual Banner */}
                <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-slate-950">
                    {/* Background Image Original Color */}
                <Image 
                    src="/images/login_banner.png" 
                    alt="Login Banner" 
                    fill 
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-[20s] ease-out select-none" 
                />
                
                {/* Cinematic Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/20 z-10" />

                <div className="relative z-20 flex items-center w-full">
                    {/* Brand Logo inside Banner */}
                    <Link href="/" className="group flex items-center select-none outline-none">
                        <div className="relative w-52 h-24 overflow-hidden transition-transform group-hover:scale-105">
                            <Image src="/sportstore-logo.png" alt="SportStore" fill className="object-contain" sizes="208px" />
                        </div>
                    </Link>
                </div>

                <div className="relative z-20 mb-10 max-w-[500px]">
                    <h2 className="text-6xl font-black tracking-tighter text-white mb-6 leading-[1.05] drop-shadow-xl">
                        Vượt Qua <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500">Khởi Đầu Mới.</span>
                    </h2>
                    <p className="text-[17px] text-slate-300 font-medium leading-relaxed drop-shadow-md">
                        Nâng tầm phong cách thể thao của bạn. Đăng nhập ngay để mở khóa những bộ sưu tập giới hạn và ưu đãi độc quyền dành riêng cho thành viên SportStore.
                    </p>
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center h-full min-h-[650px] p-6 sm:p-12 relative bg-white">

                {/* Mobile Logo Back Button */}
                <div className="absolute top-6 left-6 lg:hidden z-10">
                    <Link href="/" className="inline-flex items-center outline-none">
                        <div className="relative w-32 h-15 overflow-hidden">
                            <Image src="/sportstore-logo.png" alt="SportStore" fill className="object-contain" sizes="128px" />
                        </div>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-[440px] mx-auto bg-white rounded-[2rem] sm:p-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out mt-12 lg:mt-0">
                    
                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                            Đăng Nhập
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-base font-medium">
                            Chào mừng trở lại! Vui lòng điền thông tin để tiếp tục.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errorMsg && (
                            <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className="text-red-600 text-sm font-semibold">{errorMsg}</span>
                                {unverifiedToken && (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resendLoading}
                                        className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                                    >
                                        {resendLoading ? (
                                            <div className="h-3 w-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                        {resendLoading ? 'Đang gửi...' : 'Gửi lại link xác thực'}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="space-y-5">
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

                            <div className="space-y-2">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <Link href="/forgot-password" className="text-[12px] font-bold text-slate-900 hover:text-slate-600 transition-colors">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
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
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-bold tracking-wide rounded-full bg-slate-950 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-all duration-200 mt-2"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Hoặc tiếp tục với</span>
                        </div>
                    </div>

                    <GoogleLoginButton />

                    <div className="text-center text-[14px] text-slate-600 mt-8 font-medium">
                        Bạn chưa có tài khoản?{' '}
                        <Link href="/register" className="font-bold text-slate-950 hover:text-slate-700 underline underline-offset-4 decoration-2 decoration-slate-200 hover:decoration-slate-900 transition-all">
                            Tạo tài khoản mới
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
        <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-14 text-[15px] font-bold rounded-full border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-sm focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:ring-offset-2 transition-all"
        >
            {loading ? (
                <svg className="h-5 w-5 animate-spin text-slate-400 mr-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            )}
            {loading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
        </Button>
    );
}
