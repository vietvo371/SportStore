'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProfileForm {
    ho_va_ten: string;
    so_dien_thoai: string;
    mat_khau_cu?: string;
    mat_khau_moi?: string;
    mat_khau_moi_confirmation?: string;
}

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordMode, setIsPasswordMode] = useState(false);

    // Password visibility states
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileForm>({
        defaultValues: {
            ho_va_ten: user?.ho_va_ten || '',
            so_dien_thoai: user?.so_dien_thoai || '',
            mat_khau_cu: '',
            mat_khau_moi: '',
            mat_khau_moi_confirmation: '',
        },
    });

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const refreshedUser = await authService.getMe();
                updateUser(refreshedUser);
                reset({
                    ho_va_ten: refreshedUser.ho_va_ten,
                    so_dien_thoai: refreshedUser.so_dien_thoai || '',
                    mat_khau_cu: '',
                    mat_khau_moi: '',
                    mat_khau_moi_confirmation: '',
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchMe();
    }, [updateUser, reset]);

    const onSubmit = async (data: ProfileForm) => {
        setIsLoading(true);
        try {
            const payload: Record<string, string> = {
                ho_va_ten: data.ho_va_ten,
                so_dien_thoai: data.so_dien_thoai,
            };

            if (isPasswordMode && data.mat_khau_cu && data.mat_khau_moi) {
                payload.mat_khau_cu = data.mat_khau_cu;
                payload.mat_khau_moi = data.mat_khau_moi;
                payload.mat_khau_moi_confirmation = data.mat_khau_moi_confirmation || '';
            }

            const updatedUser = await authService.updateProfile(payload);
            updateUser(updatedUser);
            toast.success('Cập nhật thông tin thành công!');

            if (isPasswordMode) {
                setIsPasswordMode(false);
                reset({ ...data, mat_khau_cu: '', mat_khau_moi: '', mat_khau_moi_confirmation: '' });
            }
        } catch (error: any) {
            const errMsgs = error?.errors ? Object.values(error.errors).flat().join(', ') : error?.message;
            toast.error(errMsgs || 'Thay đổi thông tin thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Hồ sơ Của Tôi</CardTitle>
                    <CardDescription>
                        Quản lý thông tin bảo mật để tài khoản được tốt hơn.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
                        {/* Honeypot at the beginning of the form */}
                        <input type="text" name="email" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} autoComplete="username" />
                        <input type="password" name="password" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} autoComplete="current-password" />

                        {/* Static Email */}
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Địa chỉ Email (Đăng nhập)</Label>
                            <Input value={user?.email || ''} disabled className="bg-slate-50 cursor-not-allowed" />
                            <p className="text-xs text-muted-foreground mt-1">
                                Email không thể thay đổi sau khi đăng ký.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ho_va_ten">Họ và Tên <span className="text-red-500">*</span></Label>
                                <Input
                                    id="ho_va_ten"
                                    autoComplete="name"
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                    {...register('ho_va_ten', {
                                        required: 'Vui lòng nhập họ và tên',
                                        pattern: {
                                            value: /^[\p{L}]+(?:\s+[\p{L}]+)+$/u,
                                            message: 'Vui lòng nhập đầy đủ cả họ và tên (ít nhất 2 từ)'
                                        }
                                    })}
                                    className="focus:ring-primary/20"
                                />
                                {errors.ho_va_ten && <p className="text-sm text-red-500">{errors.ho_va_ten.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                                <Input
                                    id="so_dien_thoai"
                                    autoComplete="tel"
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                    {...register('so_dien_thoai', {
                                        pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g, message: 'Số điện thoại không hợp lệ' }
                                    })}
                                    className="focus:ring-primary/20"
                                />
                                {errors.so_dien_thoai && <p className="text-sm text-red-500">{errors.so_dien_thoai.message}</p>}
                            </div>
                        </div>

                        <Separator className="my-6 opacity-60" />

                        {/* Password Section */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                                    <KeyRound className="h-5 w-5 text-slate-400" />
                                    <span>Bảo mật mật khẩu</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsPasswordMode(!isPasswordMode)}
                                >
                                    {isPasswordMode ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}
                                </Button>
                            </div>

                            {isPasswordMode && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                                    {/* Honeypot to catch browser autofill */}
                                    <input type="text" name="email" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} autoComplete="username" />
                                    <input type="password" name="password" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} autoComplete="current-password" />

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="mat_khau_cu">Mật khẩu hiện tại</Label>
                                        <div className="relative group/pass">
                                            <Input
                                                id="mat_khau_cu"
                                                type={showOldPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                className="pr-12"
                                                {...register('mat_khau_cu', { required: isPasswordMode ? 'Vui lòng nhập mật khẩu hiện tại' : false })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all outline-none"
                                            >
                                                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {errors.mat_khau_cu && <p className="text-sm text-red-500">{errors.mat_khau_cu.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mat_khau_moi">Mật khẩu mới</Label>
                                        <div className="relative group/pass">
                                            <Input
                                                id="mat_khau_moi"
                                                type={showNewPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                className="pr-12"
                                                {...register('mat_khau_moi', {
                                                    required: isPasswordMode ? 'Vui lòng nhập mật khẩu mới' : false,
                                                    minLength: { value: 8, message: 'Ít nhất 8 ký tự' }
                                                })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all outline-none"
                                            >
                                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {errors.mat_khau_moi && <p className="text-sm text-red-500">{errors.mat_khau_moi.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mat_khau_moi_confirmation">Xác nhận mật khẩu mới</Label>
                                        <div className="relative group/pass">
                                            <Input
                                                id="mat_khau_moi_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                className="pr-12"
                                                {...register('mat_khau_moi_confirmation', { required: isPasswordMode ? 'Vui lòng xác nhận mật khẩu' : false })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all outline-none"
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" size="lg" disabled={isLoading} className="rounded-xl shadow-lg shadow-primary/20">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Lưu Thay Đổi
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
