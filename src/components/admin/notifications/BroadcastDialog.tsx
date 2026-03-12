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
import { Megaphone, Send, Loader2, Info, Tag } from "lucide-react";
import { useBroadcastNotification } from "@/hooks/useNotifications";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BroadcastDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BroadcastDialog({ open, onOpenChange }: BroadcastDialogProps) {
    const broadcastMutation = useBroadcastNotification();
    const [tieuDe, setTieuDe] = useState('');
    const [noi_dung, setNoiDung] = useState('');
    const [loai, setLoai] = useState('khuyen_mai');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!tieuDe.trim() || !noi_dung.trim()) return;

        try {
            await broadcastMutation.mutateAsync({
                tieu_de: tieuDe,
                noi_dung: noi_dung,
                loai: loai
            });
            setTieuDe('');
            setNoiDung('');
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
