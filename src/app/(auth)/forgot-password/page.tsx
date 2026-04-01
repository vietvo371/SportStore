'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const mutation = useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
        onSuccess: () => {
            setIsSuccess(true);
        },
        onError: (error: any) => {
            if (error?.errors?.email) {
                setErrorMsg(error.errors.email[0]);
            } else {
                setErrorMsg(error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        mutation.mutate(email);
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 flex items-center justify-center min-h-[85vh] relative">
            {/* Background pattern */}
            <div className="fixed inset-0 z-0 bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

            <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/80 p-8 sm:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="mb-8">
                    <Link href="/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Quay lại Đăng nhập
                    </Link>
                </div>

                {isSuccess ? (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-4">Kiểm Tra Email!</h1>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <span className="text-slate-900 font-bold">{email}</span>. 
                            Vui lòng kiểm tra hộp thư của bạn.
                        </p>
                        <Button 
                            asChild
                            className="w-full h-14 text-base font-bold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                        >
                            <Link href="/login">Xong</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 mb-10">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                Quên mật khẩu?
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Đừng lo lắng! Hãy nhập email của bạn và chúng tôi sẽ gửi cho bạn link đặt lại mật khẩu.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errorMsg && (
                                <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">
                                    Địa chỉ Email
                                </label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-[56px] px-12 text-[15px] font-medium rounded-2xl bg-white border-slate-200 outline-none focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] transition-all"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-bold tracking-wide rounded-full bg-slate-950 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-all duration-200 mt-2"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Đang gửi link...' : 'Gửi Link Đặt Lại'}
                            </Button>
                        </form>
                    </>
                )}

                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center">
                    <div className="relative w-40 h-18">
                        <Image src="/sportstore-logo.png" alt="SportStore" fill className="object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
}
