'use client';

import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Mail, Loader2, Send, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function EmailVerifyBanner() {
    const { user, isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Đảm bảo chỉ render ở client để tránh Hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Không hiện nếu chưa login, đã verify, hoặc đã bị tắt tạm thời
    if (!isAuthenticated || !user || user.xac_thuc_email_luc || dismissed) {
        return null;
    }

    const handleResend = async () => {
        setLoading(true);
        try {
            await authService.resendVerificationEmail();
            setSent(true);
            toast.success('Đã gửi lại link xác thực. Vui lòng kiểm tra hộp thư của bạn!');

            // Tự động tắt sau 30s để không làm phiền
            setTimeout(() => setSent(false), 30000);
        } catch (error: any) {
            toast.error(error.message || 'Gửi lại email thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-amber-50 border-b border-amber-200 sticky top-0 z-40 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-1.5 rounded-full">
                        <Mail className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-amber-800">
                        Email của bạn chưa được xác thực. Hãy xác thực để bảo vệ tài khoản tốt hơn!
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleResend}
                        disabled={loading || sent}
                        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : sent ? (
                            <Send className="h-3 w-3" />
                        ) : null}
                        {sent ? 'Đã gửi' : 'Gửi lại link'}
                    </button>

                    <button
                        onClick={() => setDismissed(true)}
                        className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
                        title="Tắt tạm thời"
                    >
                        <X className="h-4 w-4 text-amber-400 hover:text-amber-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
