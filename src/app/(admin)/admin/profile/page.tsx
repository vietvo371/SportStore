'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { adminService } from '@/services/admin.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Image from 'next/image';
import {
    Loader2,
    Save,
    KeyRound,
    ShieldCheck,
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Eye,
    EyeOff,
    CheckCircle2,
} from 'lucide-react';

interface ProfileForm {
    ho_va_ten: string;
    so_dien_thoai: string;
    mat_khau_cu?: string;
    mat_khau_moi?: string;
    mat_khau_moi_confirmation?: string;
}

export default function AdminProfilePage() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordMode, setIsPasswordMode] = useState(false);
    const [showPwCu, setShowPwCu] = useState(false);
    const [showPwMoi, setShowPwMoi] = useState(false);
    const [showPwConfirm, setShowPwConfirm] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
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
                const refreshed = await authService.getMe();
                updateUser(refreshed);
                reset({
                    ho_va_ten: refreshed.ho_va_ten,
                    so_dien_thoai: refreshed.so_dien_thoai || '',
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

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ảnh không được vượt quá 2MB');
            return;
        }

        setAvatarPreview(URL.createObjectURL(file));
        setAvatarUploading(true);

        try {
            const res = await adminService.uploadImage(file, 'avatars');
            const url = res?.data?.url;
            if (!url) throw new Error('Không nhận được URL ảnh');

            const updated = await authService.updateProfile({ anh_dai_dien: url });
            updateUser(updated);
            toast.success('Cập nhật ảnh đại diện thành công!');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Upload ảnh thất bại');
            setAvatarPreview(null);
        } finally {
            setAvatarUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

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

            const updated = await authService.updateProfile(payload);
            updateUser(updated);
            toast.success('Cập nhật thông tin thành công!');

            if (isPasswordMode) {
                setIsPasswordMode(false);
                reset({ ...data, mat_khau_cu: '', mat_khau_moi: '', mat_khau_moi_confirmation: '' });
            }
        } catch (error: any) {
            const msg = error?.errors
                ? Object.values(error.errors).flat().join(', ')
                : error?.message;
            toast.error(msg || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentAvatar = avatarPreview || user?.anh_dai_dien;
    const initials = user?.ho_va_ten?.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase() || 'A';

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
                <p className="text-slate-500 text-sm italic mt-1">Quản lý thông tin và bảo mật tài khoản quản trị viên.</p>
            </div>

            {/* Hero card — avatar + tên */}
            <div className="relative bg-gradient-to-br from-primary/80 to-primary rounded-2xl overflow-hidden shadow-xl shadow-primary/20">
                {/* decorative circles */}
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

                <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0 group">
                        <div className="h-24 w-24 rounded-2xl ring-4 ring-white/30 overflow-hidden bg-white/20 flex items-center justify-center">
                            {currentAvatar ? (
                                <Image
                                    src={currentAvatar}
                                    alt="avatar"
                                    width={96}
                                    height={96}
                                    unoptimized
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-3xl font-black text-white">{initials}</span>
                            )}
                        </div>

                        {/* Upload overlay */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarUploading}
                            className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                        >
                            {avatarUploading
                                ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                                : <Camera className="h-5 w-5 text-white" />
                            }
                            <span className="text-[10px] text-white font-bold">
                                {avatarUploading ? 'Đang tải...' : 'Đổi ảnh'}
                            </span>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 flex-wrap">
                            <h2 className="text-2xl font-black text-white">{user?.ho_va_ten}</h2>
                            <Badge className="bg-white/20 text-white border-white/30 border font-bold text-xs shrink-0 backdrop-blur-sm">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Quản trị viên
                            </Badge>
                        </div>
                        <p className="text-white/70 text-sm mt-1">{user?.email}</p>
                        {user?.so_dien_thoai && (
                            <p className="text-white/60 text-sm mt-0.5 flex items-center gap-1 justify-center sm:justify-start">
                                <Phone className="h-3.5 w-3.5" /> {user.so_dien_thoai}
                            </p>
                        )}
                        <p className="text-white/40 text-xs mt-3 italic">
                            Click vào ảnh để thay đổi ảnh đại diện • Tối đa 2MB
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Form thông tin — chiếm 3/5 */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        {/* Email readonly */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" /> Email đăng nhập
                            </label>
                            <Input value={user?.email || ''} disabled className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                            <p className="text-xs text-slate-400">Không thể thay đổi sau khi đăng ký.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="ho_va_ten" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" /> Họ và Tên <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="ho_va_ten"
                                    placeholder="Nhập họ và tên..."
                                    className="h-11"
                                    {...register('ho_va_ten', { required: 'Vui lòng nhập họ và tên' })}
                                />
                                {errors.ho_va_ten && <p className="text-xs text-red-500">{errors.ho_va_ten.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="so_dien_thoai" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5" /> Số điện thoại
                                </label>
                                <Input
                                    id="so_dien_thoai"
                                    placeholder="0xxx xxx xxx"
                                    className="h-11"
                                    {...register('so_dien_thoai', {
                                        pattern: {
                                            value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    })}
                                />
                                {errors.so_dien_thoai && <p className="text-xs text-red-500">{errors.so_dien_thoai.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading || (!isDirty && !isPasswordMode)}
                                className="h-11 px-8 rounded-xl shadow-lg shadow-primary/20 font-bold"
                            >
                                {isLoading
                                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    : <Save className="mr-2 h-4 w-4" />
                                }
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Password section — chiếm 2/5 */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-slate-800">Bảo mật</h3>
                    </div>

                    <div className="p-6">
                        {!isPasswordMode ? (
                            <div className="flex flex-col items-center gap-4 py-4 text-center">
                                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <KeyRound className="h-7 w-7 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm">Mật khẩu đang được bảo mật</p>
                                    <p className="text-xs text-slate-400 mt-1">Thay đổi định kỳ để bảo vệ tài khoản.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full h-10 rounded-xl font-semibold"
                                    onClick={() => setIsPasswordMode(true)}
                                >
                                    <KeyRound className="h-4 w-4 mr-2" />
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                {/* Current password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mật khẩu hiện tại</label>
                                    <div className="relative">
                                        <Input
                                            type={showPwCu ? 'text' : 'password'}
                                            className="h-10 pr-10"
                                            {...register('mat_khau_cu', { required: 'Bắt buộc' })}
                                        />
                                        <button type="button" onClick={() => setShowPwCu(!showPwCu)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPwCu ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.mat_khau_cu && <p className="text-xs text-red-500">{errors.mat_khau_cu.message}</p>}
                                </div>

                                {/* New password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Input
                                            type={showPwMoi ? 'text' : 'password'}
                                            className="h-10 pr-10"
                                            {...register('mat_khau_moi', {
                                                required: 'Bắt buộc',
                                                minLength: { value: 8, message: 'Ít nhất 8 ký tự' },
                                            })}
                                        />
                                        <button type="button" onClick={() => setShowPwMoi(!showPwMoi)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPwMoi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.mat_khau_moi && <p className="text-xs text-red-500">{errors.mat_khau_moi.message}</p>}
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <Input
                                            type={showPwConfirm ? 'text' : 'password'}
                                            className="h-10 pr-10"
                                            {...register('mat_khau_moi_confirmation', { required: 'Bắt buộc' })}
                                        />
                                        <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPwConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.mat_khau_moi_confirmation && <p className="text-xs text-red-500">{errors.mat_khau_moi_confirmation.message}</p>}
                                </div>

                                <Separator />

                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" className="flex-1 h-10 rounded-xl" onClick={() => setIsPasswordMode(false)}>
                                        Hủy
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="flex-1 h-10 rounded-xl shadow-lg shadow-primary/20 font-bold">
                                        {isLoading
                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                            : <CheckCircle2 className="h-4 w-4 mr-1" />
                                        }
                                        Xác nhận
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
