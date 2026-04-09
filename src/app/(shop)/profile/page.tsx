'use client';

import { useState, useEffect, useId, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Save, KeyRound, Eye, EyeOff, ArrowLeft, Lock, ShieldCheck, User, Camera } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    const router = useRouter();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const pwdFieldId = useId();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
        // Kiểm tra có thay đổi gì không
        const hoVaTenChanged = data.ho_va_ten.trim() !== (user?.ho_va_ten || '').trim();
        const soDienThoaiChanged = (data.so_dien_thoai || '').trim() !== ((user?.so_dien_thoai) || '').trim();

        if (!hoVaTenChanged && !soDienThoaiChanged) {
            toast.error('Vui lòng thay đổi thông tin trước khi lưu.');
            return;
        }

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
                reset({
                    ho_va_ten: data.ho_va_ten,
                    so_dien_thoai: data.so_dien_thoai,
                    mat_khau_cu: '',
                    mat_khau_moi: '',
                    mat_khau_moi_confirmation: '',
                });
            }
        } catch (error: any) {
            const errMsgs = error?.errors ? Object.values(error.errors).flat().join(', ') : error?.message;
            toast.error(errMsgs || 'Thay đổi thông tin thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentAvatar = avatarPreview || user?.anh_dai_dien || null;
    const initials =
        user?.ho_va_ten
            ?.split(' ')
            .filter(Boolean)
            .slice(-2)
            .map((w: string) => w[0])
            .join('')
            .toUpperCase() || 'K';

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ảnh không được vượt quá 2MB');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setAvatarUploading(true);

        try {
            const upload = await authService.uploadAvatar(file);
            const url = upload?.url;
            if (!url) throw new Error('Không nhận được URL ảnh');

            const updated = await authService.updateProfile({ anh_dai_dien: url });
            updateUser(updated);
            setAvatarPreview(null);
            toast.success('Cập nhật ảnh đại diện thành công!');
        } catch (error: any) {
            const msg = error?.message || 'Upload ảnh thất bại';
            toast.error(typeof msg === 'string' ? msg : 'Upload ảnh thất bại');
            setAvatarPreview(null);
        } finally {
            URL.revokeObjectURL(objectUrl);
            setAvatarUploading(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5"
            >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
            </Button>

            {/* ── Card 1: Thông tin tài khoản ── */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Thông tin tài khoản</h2>
                        <p className="text-sm text-slate-500">Cập nhật ảnh đại diện, họ tên và số điện thoại</p>
                    </div>
                </div>

                <CardContent className="p-6">
                    {/* Ảnh đại diện */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 mb-6 border-b border-slate-100">
                        <div className="relative shrink-0 group mx-auto sm:mx-0">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl ring-4 ring-slate-100 overflow-hidden bg-gradient-to-br from-primary/15 to-slate-100 flex items-center justify-center shadow-inner">
                                {currentAvatar ? (
                                    <Image
                                        src={currentAvatar}
                                        alt={user?.ho_va_ten || 'Ảnh đại diện'}
                                        width={112}
                                        height={112}
                                        unoptimized
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-2xl sm:text-3xl font-black text-primary/70">{initials}</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={avatarUploading}
                                className="absolute inset-0 rounded-2xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                                aria-label="Đổi ảnh đại diện"
                            >
                                {avatarUploading ? (
                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="h-6 w-6 text-white" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                                            Đổi ảnh
                                        </span>
                                    </>
                                )}
                            </button>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <p className="text-sm font-semibold text-slate-800">Ảnh đại diện</p>
                            <p className="text-xs text-slate-500">
                                JPG, PNG, GIF hoặc WebP — tối đa 2MB. Ảnh hiển thị trên tài khoản của bạn.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={avatarUploading}
                                onClick={() => avatarInputRef.current?.click()}
                                className="rounded-xl gap-2"
                            >
                                {avatarUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                                Tải ảnh lên
                            </Button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email (readonly) */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Địa chỉ Email</Label>
                            <Input
                                value={user?.email || ''}
                                disabled
                                className="bg-slate-100 cursor-not-allowed border-slate-200 text-slate-500"
                            />
                            <p className="text-xs text-slate-400">
                                Email không thể thay đổi sau khi đăng ký
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="ho_va_ten" className="text-sm font-semibold text-slate-700">
                                    Họ và Tên <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ho_va_ten"
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                    {...register('ho_va_ten', {
                                        required: 'Vui lòng nhập họ và tên',
                                        pattern: {
                                            value: /^[\p{L}]+(?:\s+[\p{L}]+)+$/u,
                                            message: 'Vui lòng nhập đầy đủ cả họ và tên (ít nhất 2 từ)',
                                        },
                                    })}
                                    className="focus-visible:ring-primary/30"
                                />
                                {errors.ho_va_ten && (
                                    <p className="text-xs text-red-500 font-medium">{errors.ho_va_ten.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="so_dien_thoai" className="text-sm font-semibold text-slate-700">
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="so_dien_thoai"
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                    {...register('so_dien_thoai', {
                                        pattern: {
                                            value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    })}
                                    className="focus-visible:ring-primary/30"
                                />
                                {errors.so_dien_thoai && (
                                    <p className="text-xs text-red-500 font-medium">{errors.so_dien_thoai.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="rounded-xl shadow-lg shadow-primary/20 gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* ── Card 2: Bảo mật & Mật khẩu ── */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Bảo mật tài khoản</h2>
                        <p className="text-sm text-slate-500">Đổi mật khẩu để bảo vệ tài khoản của bạn</p>
                    </div>
                </div>

                <CardContent className="p-6">
                    {!isPasswordMode ? (
                        <div className="flex items-center justify-between py-3 px-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Mật khẩu hiện tại</p>
                                    <p className="text-xs text-slate-500">••••••••••••</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsPasswordMode(true)}
                                className="rounded-lg border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 gap-1.5"
                            >
                                <KeyRound className="h-4 w-4" />
                                Đổi mật khẩu
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                    Nhập thông tin mật khẩu mới
                                </p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsPasswordMode(false);
                                        reset({
                                            ho_va_ten: user?.ho_va_ten || '',
                                            so_dien_thoai: user?.so_dien_thoai || '',
                                            mat_khau_cu: '',
                                            mat_khau_moi: '',
                                            mat_khau_moi_confirmation: '',
                                        });
                                    }}
                                    className="text-slate-400 hover:text-slate-600 text-xs h-7 px-2"
                                >
                                    Hủy
                                </Button>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                                autoComplete="off"
                                method="post"
                            >
                                {/* Mật khẩu hiện tại — type=text + webkit masking để trình duyệt không mở kho mật khẩu */}
                                <div className="space-y-1.5">
                                    <Label htmlFor={`${pwdFieldId}-cu`} className="text-sm font-semibold text-slate-700">
                                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`${pwdFieldId}-cu`}
                                            type="text"
                                            inputMode="text"
                                            autoComplete="off"
                                            spellCheck={false}
                                            autoCapitalize="off"
                                            data-lpignore="true"
                                            data-1p-ignore="true"
                                            data-form-type="other"
                                            {...register('mat_khau_cu', {
                                                required: 'Vui lòng nhập mật khẩu hiện tại',
                                            })}
                                            readOnly
                                            onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                                            className={cn(
                                                'pr-12',
                                                !showOldPassword && '[-webkit-text-security:disc] [text-security:disc]'
                                            )}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.mat_khau_cu && (
                                        <p className="text-xs text-red-500 font-medium">{errors.mat_khau_cu.message}</p>
                                    )}
                                </div>

                                {/* Mật khẩu mới */}
                                <div className="space-y-1.5">
                                    <Label htmlFor={`${pwdFieldId}-moi`} className="text-sm font-semibold text-slate-700">
                                        Mật khẩu mới <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`${pwdFieldId}-moi`}
                                            type="text"
                                            inputMode="text"
                                            autoComplete="off"
                                            spellCheck={false}
                                            autoCapitalize="off"
                                            data-lpignore="true"
                                            data-1p-ignore="true"
                                            data-form-type="other"
                                            {...register('mat_khau_moi', {
                                                required: 'Vui lòng nhập mật khẩu mới',
                                                minLength: { value: 8, message: 'Mật khẩu mới phải ít nhất 8 ký tự' },
                                            })}
                                            readOnly
                                            onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                                            className={cn(
                                                'pr-12',
                                                !showNewPassword && '[-webkit-text-security:disc] [text-security:disc]'
                                            )}
                                            placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.mat_khau_moi && (
                                        <p className="text-xs text-red-500 font-medium">{errors.mat_khau_moi.message}</p>
                                    )}
                                </div>

                                {/* Xác nhận mật khẩu mới */}
                                <div className="space-y-1.5">
                                    <Label htmlFor={`${pwdFieldId}-xn`} className="text-sm font-semibold text-slate-700">
                                        Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`${pwdFieldId}-xn`}
                                            type="text"
                                            inputMode="text"
                                            autoComplete="off"
                                            spellCheck={false}
                                            autoCapitalize="off"
                                            data-lpignore="true"
                                            data-1p-ignore="true"
                                            data-form-type="other"
                                            {...register('mat_khau_moi_confirmation', {
                                                required: 'Vui lòng xác nhận mật khẩu mới',
                                            })}
                                            readOnly
                                            onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                                            className={cn(
                                                'pr-12',
                                                !showConfirmPassword && '[-webkit-text-security:disc] [text-security:disc]'
                                            )}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.mat_khau_moi_confirmation && (
                                        <p className="text-xs text-red-500 font-medium">{errors.mat_khau_moi_confirmation.message}</p>
                                    )}
                                </div>

                                {/* Hướng dẫn bảo mật */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                                    <p className="text-xs text-blue-700 font-semibold mb-1">Mật khẩu mới cần đảm bảo:</p>
                                    <ul className="text-xs text-blue-600 space-y-0.5 pl-4 list-disc">
                                        <li>Ít nhất 8 ký tự</li>
                                        <li>Khác với mật khẩu cũ</li>
                                        <li>Khuyến nghị kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                                    </ul>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsPasswordMode(false);
                                            reset({
                                                ho_va_ten: user?.ho_va_ten || '',
                                                so_dien_thoai: user?.so_dien_thoai || '',
                                                mat_khau_cu: '',
                                                mat_khau_moi: '',
                                                mat_khau_moi_confirmation: '',
                                            });
                                        }}
                                        className="rounded-xl"
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isLoading}
                                        className="rounded-xl shadow-lg shadow-primary/20 gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4" />
                                        )}
                                        Cập nhật mật khẩu
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
