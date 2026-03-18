import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBanner, useUpdateBanner } from "@/hooks/useAdminBanners";
import { adminService } from "@/services/admin.service";
import { Switch } from "@/components/ui/switch";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface BannerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner: any;
    onClose: (changed?: boolean) => void;
}

export function BannerDialog({ open, onOpenChange, banner, onClose }: BannerDialogProps) {
    const isEdit = !!banner;
    const createMutation = useCreateBanner();
    const updateMutation = useUpdateBanner();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [tieuDe, setTieuDe] = useState('');
    const [hinhAnh, setHinhAnh] = useState('');
    const [duongDan, setDuongDan] = useState('');
    const [thuTu, setThuTu] = useState<number>(0);
    const [trangThai, setTrangThai] = useState(true);

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) {
            if (isEdit && banner) {
                setTieuDe(banner.tieu_de || '');
                setHinhAnh(banner.hinh_anh || '');
                setDuongDan(banner.duong_dan || '');
                setThuTu(banner.thu_tu || 0);
                setTrangThai(banner.trang_thai === 1);
            } else {
                setTieuDe('');
                setHinhAnh('');
                setDuongDan('');
                setThuTu(0);
                setTrangThai(true);
            }
        }
    }, [open, banner, isEdit]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validating type and size
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh hợp lệ.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Kích thước ảnh không được vượt quá 2MB.');
            return;
        }

        try {
            setUploading(true);
            const res = await adminService.uploadImage(file, 'banners');
            if (res.data?.url) {
                setHinhAnh(res.data.url);
                toast.success('Upload ảnh thành công');
            }
        } catch (error: any) {
            console.error('Lỗi upload ảnh:', error);
            const status = error?.response?.status ?? error?.status;
            if (status === 413) {
                toast.error('File ảnh quá lớn. Server chỉ nhận file tối đa 2MB.');
            } else {
                toast.error(error?.response?.data?.message || 'Có lỗi khi upload hình ảnh');
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = () => {
        setHinhAnh('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tieuDe.trim()) {
            toast.error('Vui lòng nhập tiêu đề banner');
            return;
        }

        if (!hinhAnh) {
            toast.error('Vui lòng upload hình ảnh banner');
            return;
        }

        const data = {
            tieu_de: tieuDe,
            hinh_anh: hinhAnh,
            duong_dan: duongDan,
            thu_tu: thuTu,
            trang_thai: trangThai ? 1 : 0,
        };

        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: banner.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            onClose(true);
        } catch (error) {
            console.error(error);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-indigo-500" />
                        {isEdit ? "Cập nhật Banner" : "Thêm Banner Mới"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        
                        {/* Image Upload Area */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-slate-700">Hình ảnh Banner <span className="text-rose-500">*</span></Label>
                            
                            <div className={`
                                border-2 border-dashed rounded-xl p-4 transition-colors
                                ${hinhAnh ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-slate-50/80'}
                            `}>
                                {hinhAnh ? (
                                    <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-slate-200 group">
                                        <Image
                                            src={hinhAnh.startsWith('http') ? hinhAnh : (banner?.url && banner.hinh_anh === hinhAnh ? banner.url : hinhAnh)}
                                            alt="Banner preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleRemoveImage}
                                                className="shadow-lg"
                                            >
                                                <X className="h-4 w-4 mr-1" /> Gỡ ảnh này
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        className="w-full aspect-[21/9] flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {uploading ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-2" />
                                                <span className="text-sm font-medium text-indigo-600">Đang tải ảnh lên...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 text-slate-400 mb-3" />
                                                <span className="font-medium text-slate-700">Nhấn để tải ảnh lên</span>
                                                <span className="text-xs text-slate-400 mt-1">Hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)</span>
                                                <span className="text-xs text-slate-400 mt-1">Tỉ lệ khuyên dùng: 21:9</span>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        {/* Text Inputs */}
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tieu_de" className="font-semibold text-slate-700">Tiêu đề <span className="text-rose-500">*</span></Label>
                                <Input
                                    id="tieu_de"
                                    value={tieuDe}
                                    onChange={(e) => setTieuDe(e.target.value)}
                                    placeholder="Nhập tiêu đề banner..."
                                    className="focus-visible:ring-indigo-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duong_dan" className="font-semibold text-slate-700">Đường dẫn liên kết (URL)</Label>
                                <Input
                                    id="duong_dan"
                                    value={duongDan}
                                    onChange={(e) => setDuongDan(e.target.value)}
                                    placeholder="Ví dụ: /products/giay-chay-bo"
                                    className="focus-visible:ring-indigo-500"
                                />
                                <p className="text-xs text-slate-500">Khách hàng sẽ được chuyển đến URL này khi nhấn vào banner.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="thu_tu" className="font-semibold text-slate-700">Thứ tự hiển thị</Label>
                                    <Input
                                        id="thu_tu"
                                        type="number"
                                        value={thuTu}
                                        onChange={(e) => setThuTu(parseInt(e.target.value) || 0)}
                                        className="focus-visible:ring-indigo-500"
                                    />
                                    <p className="text-[11px] text-slate-500 w-full">Số nhỏ sẽ hiển thị trước.</p>
                                </div>
                                <div className="space-y-2 flex flex-col justify-center pt-2">
                                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                                        <div className="space-y-0.5">
                                            <Label className="font-semibold text-slate-700">Trạng thái</Label>
                                            <p className="text-[11px] text-slate-500">{trangThai ? 'Đang hiển thị' : 'Đang ẩn'}</p>
                                        </div>
                                        <Switch
                                            checked={trangThai}
                                            onCheckedChange={setTrangThai}
                                            className="data-[state=checked]:bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting || uploading}
                            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        >
                            Hủy bỏ
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || uploading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
                            ) : (
                                isEdit ? "Cập nhật Banner" : "Tạo Banner"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
