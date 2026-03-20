"use client";

import { useState } from "react";
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
import { Megaphone, Send, Loader2, Info, Tag, Link as LinkIcon, Search } from "lucide-react";
import { useBroadcastNotification } from "@/hooks/useNotifications";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

interface BroadcastDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BroadcastDialog({ open, onOpenChange }: BroadcastDialogProps) {
    const broadcastMutation = useBroadcastNotification();
    const [tieuDe, setTieuDe] = useState('');
    const [noi_dung, setNoiDung] = useState('');
    const [loai, setLoai] = useState('khuyen_mai');
    
    // Link states
    const [linkType, setLinkType] = useState('none');
    
    // Custom Link state
    const [customLink, setCustomLink] = useState('');
    
    // Category states
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!tieuDe.trim() || !noi_dung.trim()) return;

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
                gui_email: sendEmail
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
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isSubmitting = broadcastMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-rose-500" />
                        Gửi Thông Báo Quảng Bá
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                className="min-h-[120px] focus-visible:ring-rose-500 bg-slate-50 border-slate-200 resize-none"
                                required
                            />
                        </div>

                        {loai === 'khuyen_mai' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-100 pt-4 mt-2">
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
                            Lưu ý: Thông báo này sẽ được gửi tới TẤT CẢ người dùng trong hệ thống ngay sau khi bạn nhấn "Phát sóng".
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
                            disabled={isSubmitting || !tieuDe || !noi_dung}
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
