"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Send, Loader2, Info, Tag, Link as LinkIcon, Search, Users, Target, ShoppingBag, Eye, Heart } from "lucide-react";
import { useBroadcastNotification, usePreviewTargetCount } from "@/hooks/useNotifications";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

interface BroadcastDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BroadcastDialog({ open, onOpenChange }: BroadcastDialogProps) {
    const broadcastMutation = useBroadcastNotification();
    const previewMutation = usePreviewTargetCount();
    const [tieuDe, setTieuDe] = useState('');
    const [noi_dung, setNoiDung] = useState('');
    const [loai, setLoai] = useState('khuyen_mai');

    // Targeting states
    const [targetMode, setTargetMode] = useState<'tat_ca' | 'muc_tieu'>('tat_ca');
    const [selectedTargetCategoryIds, setSelectedTargetCategoryIds] = useState<number[]>([]);

    // Link states
    const [linkType, setLinkType] = useState('none');
    const [customLink, setCustomLink] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    // Email state
    const [sendEmail, setSendEmail] = useState(false);

    const { data: categories } = useQuery({
        queryKey: ['categories-list-for-broadcast'],
        queryFn: () => categoryService.getCategories(),
    });

    const flattenCategories = (items: any[], depth = 0): any[] => {
        let result: any[] = [];
        items.forEach((item) => {
            result.push({ id: item.id, ten: item.ten, depth, duong_dan: item.duong_dan });
            if (item.danh_muc_con && item.danh_muc_con.length > 0) {
                result = [...result, ...flattenCategories(item.danh_muc_con, depth + 1)];
            }
        });
        return result;
    };
    const flatCategories = categories ? flattenCategories(categories) : [];

    // Product search states
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductPath, setSelectedProductPath] = useState('');

    const { data: searchProductsData, isFetching: isSearchingProducts } = useQuery({
        queryKey: ['products-search-broadcast', searchTerm],
        queryFn: () => productService.getProducts({ search: searchTerm, limit: 10 }),
        enabled: linkType === 'product' && searchTerm.length >= 2,
    });
    const searchedProducts = searchProductsData?.data || [];

    // Preview target count khi chọn danh mục targeting
    const previewData = previewMutation.data as any;

    const handlePreview = useCallback(() => {
        if (selectedTargetCategoryIds.length > 0) {
            previewMutation.mutate(selectedTargetCategoryIds);
        }
    }, [selectedTargetCategoryIds]);

    useEffect(() => {
        if (targetMode === 'muc_tieu' && selectedTargetCategoryIds.length > 0) {
            const timer = setTimeout(handlePreview, 400);
            return () => clearTimeout(timer);
        }
    }, [selectedTargetCategoryIds, targetMode, handlePreview]);

    const toggleTargetCategory = (id: number) => {
        setSelectedTargetCategoryIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tieuDe.trim() || !noi_dung.trim()) return;
        if (targetMode === 'muc_tieu' && selectedTargetCategoryIds.length === 0) return;

        let finalLink = undefined;
        if (loai === 'khuyen_mai') {
            if (linkType === 'product' && selectedProductPath) {
                finalLink = selectedProductPath;
            } else if (linkType === 'category' && selectedCategoryId) {
                const category = flatCategories?.find((c: any) => c.id.toString() === selectedCategoryId);
                if (category) finalLink = `/products?category=${category.duong_dan}`;
            } else if (linkType === 'custom' && customLink.trim()) {
                finalLink = customLink.trim();
            }
        }

        try {
            await broadcastMutation.mutateAsync({
                tieu_de: tieuDe,
                noi_dung: noi_dung,
                loai: loai,
                du_lieu_them: finalLink ? { link: finalLink } : undefined,
                gui_email: sendEmail,
                che_do: targetMode,
                danh_muc_ids: targetMode === 'muc_tieu' ? selectedTargetCategoryIds : undefined,
            });
            setTieuDe('');
            setNoiDung('');
            setLinkType('none');
            setSelectedProductId('');
            setSelectedProductPath('');
            setSearchTerm('');
            setSelectedCategoryId('');
            setCustomLink('');
            setSendEmail(false);
            setTargetMode('tat_ca');
            setSelectedTargetCategoryIds([]);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isSubmitting = broadcastMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] max-h-[90vh] p-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-rose-500" />
                        Gửi Thông Báo Quảng Bá
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="loai" className="font-semibold text-slate-700">Loại thông báo</Label>
                            <Select value={loai} onValueChange={setLoai}>
                                <SelectTrigger id="loai" className="focus-visible:ring-rose-500 bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Chọn loại thông báo" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="khuyen_mai" className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-rose-500" />
                                            <span>Khuyến mãi mới</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="he_thong" className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-blue-500" />
                                            <span>Thông báo hệ thống</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tieu_de" className="font-semibold text-slate-700">Tiêu đề quảng bá</Label>
                            <Input
                                id="tieu_de"
                                value={tieuDe}
                                onChange={(e) => setTieuDe(e.target.value)}
                                placeholder="Ví dụ: Siêu SALE Giày Đá Bóng - Giảm 50%..."
                                className="focus-visible:ring-rose-500 bg-slate-50 border-slate-200"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="noi_dung" className="font-semibold text-slate-700">Nội dung chi tiết</Label>
                            <Textarea
                                id="noi_dung"
                                value={noi_dung}
                                onChange={(e) => setNoiDung(e.target.value)}
                                placeholder="Mô tả chi tiết chương trình khuyến mãi hoặc thông báo của bạn..."
                                className="min-h-[100px] focus-visible:ring-rose-500 bg-slate-50 border-slate-200 resize-none"
                                required
                            />
                        </div>

                        {/* Targeting Section */}
                        {loai === 'khuyen_mai' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-100 pt-4">
                                <Label className="font-semibold text-slate-700 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-slate-400" />
                                    Đối tượng nhận thông báo
                                </Label>

                                <RadioGroup
                                    value={targetMode}
                                    onValueChange={(v) => setTargetMode(v as 'tat_ca' | 'muc_tieu')}
                                    className="flex flex-wrap gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="tat_ca" id="t-all" />
                                        <Label htmlFor="t-all" className="cursor-pointer font-normal flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5 text-slate-400" />
                                            Tất cả khách hàng
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="muc_tieu" id="t-targeted" />
                                        <Label htmlFor="t-targeted" className="cursor-pointer font-normal flex items-center gap-1.5">
                                            <Target className="h-3.5 w-3.5 text-rose-500" />
                                            Theo sở thích / lịch sử mua
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {targetMode === 'muc_tieu' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-200 space-y-3 pl-1">
                                        <p className="text-[11px] text-slate-500">
                                            Chọn danh mục sản phẩm. Hệ thống sẽ tự động lọc khách hàng đã mua, xem, hoặc yêu thích sản phẩm thuộc các danh mục này.
                                        </p>
                                        <div className="max-h-[180px] overflow-y-auto border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
                                            {flatCategories.map((c: any) => (
                                                <label
                                                    key={c.id}
                                                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${selectedTargetCategoryIds.includes(c.id) ? 'bg-rose-50 border border-rose-200' : 'hover:bg-slate-100 border border-transparent'}`}
                                                >
                                                    <Checkbox
                                                        checked={selectedTargetCategoryIds.includes(c.id)}
                                                        onCheckedChange={() => toggleTargetCategory(c.id)}
                                                        className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                                    />
                                                    <span className={`text-sm ${c.depth > 0 ? 'text-slate-500' : 'font-medium text-slate-800'}`}>
                                                        {"— ".repeat(c.depth)}{c.ten}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        {selectedTargetCategoryIds.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedTargetCategoryIds.map(id => {
                                                    const cat = flatCategories.find((c: any) => c.id === id);
                                                    return cat ? (
                                                        <Badge
                                                            key={id}
                                                            variant="secondary"
                                                            className="bg-rose-100 text-rose-700 hover:bg-rose-200 cursor-pointer text-xs"
                                                            onClick={() => toggleTargetCategory(id)}
                                                        >
                                                            {cat.ten} ×
                                                        </Badge>
                                                    ) : null;
                                                })}
                                            </div>
                                        )}

                                        {/* Preview Count */}
                                        {selectedTargetCategoryIds.length > 0 && (
                                            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-2">
                                                {previewMutation.isPending ? (
                                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        Đang phân tích khách hàng...
                                                    </div>
                                                ) : previewData?.data ? (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-blue-900">
                                                                Sẽ gửi đến {previewData.data.tong_muc_tieu} / {previewData.data.tong_tat_ca} khách hàng
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-[11px] text-blue-700">
                                                            <span className="flex items-center gap-1">
                                                                <ShoppingBag className="h-3 w-3" />
                                                                Đã mua: {previewData.data.tu_mua_hang}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                Đã xem/click: {previewData.data.tu_hanh_vi}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Heart className="h-3 w-3" />
                                                                Yêu thích: {previewData.data.tu_yeu_thich}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Link Section */}
                        {loai === 'khuyen_mai' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-100 pt-4">
                                <Label className="font-semibold text-slate-700 flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-slate-400" />
                                    Hành động khi click (Liên kết)
                                </Label>

                                <RadioGroup
                                    value={linkType}
                                    onValueChange={setLinkType}
                                    className="flex flex-wrap gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="none" id="r-none" />
                                        <Label htmlFor="r-none" className="cursor-pointer font-normal">Không kèm link</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="product" id="r-product" />
                                        <Label htmlFor="r-product" className="cursor-pointer font-normal">Sản phẩm</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="category" id="r-category" />
                                        <Label htmlFor="r-category" className="cursor-pointer font-normal">Danh mục</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="custom" id="r-custom" />
                                        <Label htmlFor="r-custom" className="cursor-pointer font-normal">Tự nhập Link</Label>
                                    </div>
                                </RadioGroup>

                                {linkType === 'product' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-200 pl-6 relative">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowProductDropdown(true);
                                                    if (e.target.value === '') {
                                                        setSelectedProductId('');
                                                        setSelectedProductPath('');
                                                    }
                                                }}
                                                placeholder="Nhập tên sản phẩm để tìm kiếm..."
                                                className="pl-9 w-full bg-slate-50 border-slate-200 focus-visible:ring-rose-500"
                                                onFocus={() => setShowProductDropdown(true)}
                                            />
                                            {isSearchingProducts && (
                                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
                                            )}
                                        </div>

                                        {showProductDropdown && searchTerm.length >= 2 && (
                                            <div className="absolute z-50 w-[calc(100%-1.5rem)] mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-[250px] overflow-y-auto">
                                                {searchedProducts.length === 0 && !isSearchingProducts ? (
                                                    <div className="p-4 text-center text-sm text-slate-500">Không tìm thấy sản phẩm nào</div>
                                                ) : (
                                                    searchedProducts.map((p: any) => (
                                                        <div
                                                            key={p.id}
                                                            className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                                            onClick={() => {
                                                                setSelectedProductId(p.id.toString());
                                                                setSelectedProductPath(`/products/${p.duong_dan}`);
                                                                setSearchTerm(p.ten_san_pham);
                                                                setShowProductDropdown(false);
                                                            }}
                                                        >
                                                            <div className="flex flex-col flex-1 pl-1">
                                                                <span className="text-sm font-medium text-slate-900 line-clamp-1">{p.ten_san_pham}</span>
                                                                <span className="text-[11px] text-rose-600 font-bold">
                                                                    {p.gia_khuyen_mai ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.gia_khuyen_mai) : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.gia_goc)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                        {selectedProductId && !showProductDropdown && (
                                            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-1 rounded">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Đã chọn sản phẩm
                                            </div>
                                        )}
                                        <p className="text-[11px] text-slate-500 mt-1.5">
                                            Khách hàng sẽ được chuyển đến trang chi tiết của sản phẩm này.
                                        </p>
                                    </div>
                                )}

                                {linkType === 'category' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-200 pl-6">
                                        <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-rose-500">
                                                <SelectValue placeholder="Chọn danh mục khuyến mãi..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[250px] bg-white">
                                                {flatCategories.map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>
                                                        {"— ".repeat(c.depth)} {c.ten}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[11px] text-slate-500 mt-1.5">
                                            Khách hàng sẽ được chuyển đến trang lọc các sản phẩm thuộc danh mục này.
                                        </p>
                                    </div>
                                )}

                                {linkType === 'custom' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-200 pl-6">
                                        <Input
                                            value={customLink}
                                            onChange={(e) => setCustomLink(e.target.value)}
                                            placeholder="Ví dụ: /flash-sale-11-11"
                                            className="focus-visible:ring-rose-500 bg-slate-50 border-slate-200"
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1.5">
                                            Nhập đường dẫn tùy chọn (Ví dụ landing page hoặc web khác).
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-row items-center justify-between rounded-xl border border-slate-200 p-4 bg-white mt-4 hover:border-rose-200 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold text-slate-900 cursor-pointer" onClick={() => setSendEmail(!sendEmail)}>Gửi kèm qua Email</Label>
                                <p className="text-[11px] text-slate-500">Khách hàng sẽ nhận được một bản sao thông báo qua email cá nhân.</p>
                            </div>
                            <Switch
                                checked={sendEmail}
                                onCheckedChange={setSendEmail}
                                className="data-[state=checked]:bg-rose-500"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-100/50">
                        <p className="text-xs text-rose-600 flex items-start gap-2 italic">
                            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            {targetMode === 'muc_tieu' && selectedTargetCategoryIds.length > 0 && previewData?.data
                                ? `Thông báo sẽ được gửi tới ${previewData.data.tong_muc_tieu} khách hàng có nhu cầu với danh mục đã chọn.`
                                : 'Lưu ý: Thông báo này sẽ được gửi tới TẤT CẢ người dùng trong hệ thống ngay sau khi bạn nhấn "Phát sóng".'
                            }
                        </p>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !tieuDe || !noi_dung || (targetMode === 'muc_tieu' && selectedTargetCategoryIds.length === 0)}
                            className="bg-rose-600 hover:bg-rose-700 text-white min-w-[140px] shadow-lg shadow-rose-200"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang chuẩn bị...</>
                            ) : (
                                <><Send className="mr-2 h-4 w-4" /> Phát sóng ngay</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
