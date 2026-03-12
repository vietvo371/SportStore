'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Ticket,
    Edit,
    Trash2,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Info
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useDeleteCoupon, useUpdateCoupon } from "@/hooks/useAdminCoupons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CouponTableProps {
    coupons: any[];
    onEdit: (coupon: any) => void;
}

export function CouponTable({ coupons, onEdit }: CouponTableProps) {
    const deleteCoupon = useDeleteCoupon();
    const updateCoupon = useUpdateCoupon();

    const getStatusBadge = (coupon: any) => {
        const now = new Date();
        const start = coupon.bat_dau_luc ? new Date(coupon.bat_dau_luc) : null;
        const end = coupon.het_han_luc ? new Date(coupon.het_han_luc) : null;

        if (end && now > end) {
            return (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                    Hết hạn
                </Badge>
            );
        }

        if (start && now < start) {
            return (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    Chưa bắt đầu
                </Badge>
            );
        }

        if (coupon.gioi_han_su_dung && coupon.da_su_dung >= coupon.gioi_han_su_dung) {
            return (
                <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                    Hết lượt
                </Badge>
            );
        }

        return (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Đang chạy
            </Badge>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[20%]">Mã Code / Loại</TableHead>
                        <TableHead className="py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Mức giảm</TableHead>
                        <TableHead className="py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Đã dùng</TableHead>
                        <TableHead className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Thời hạn</TableHead>
                        <TableHead className="py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[10%]">Trạng thái</TableHead>
                        <TableHead className="py-5 px-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coupons.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                    <Ticket className="h-10 w-10 opacity-20" />
                                    <p className="font-medium">Chưa có mã giảm giá nào</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        coupons.map((coupon) => (
                            <TableRow key={coupon.id} className="hover:bg-slate-50/30 transition-colors border-slate-50 last:border-0">
                                <TableCell className="py-6 px-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                                                <Ticket className="h-4 w-4" />
                                            </div>
                                            <span className="font-black text-slate-900 tracking-tight text-sm uppercase">{coupon.ma_code}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-10">
                                            {coupon.loai_giam === 'phan_tram' ? 'Giảm theo %' : 'Giảm tiền mặt'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-black text-slate-900">
                                            {coupon.loai_giam === 'phan_tram'
                                                ? `${coupon.gia_tri}%`
                                                : formatCurrency(coupon.gia_tri)}
                                        </span>
                                        {coupon.gia_tri_don_hang_min > 0 && (
                                            <span className="text-[10px] font-bold text-slate-400">
                                                Min: {formatCurrency(coupon.gia_tri_don_hang_min)}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    <div className="flex flex-col items-center gap-1.5 grayscale-[0.5]">
                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${Math.min(100, (coupon.da_su_dung / (coupon.gioi_han_su_dung || 100)) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-700">
                                            {coupon.da_su_dung} / {coupon.gioi_han_su_dung || '∞'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {coupon.bat_dau_luc ? formatDate(coupon.bat_dau_luc) : 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                                            <XCircle className="h-3.5 w-3.5 text-rose-300" />
                                            {coupon.het_han_luc ? formatDate(coupon.het_han_luc) : 'Vĩnh viễn'}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    {getStatusBadge(coupon)}
                                </TableCell>
                                <TableCell className="py-6 px-6 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl p-0 hover:bg-slate-100 text-slate-600"
                                                        onClick={() => onEdit(coupon)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Chỉnh sửa</TooltipContent>
                                            </Tooltip>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl sm:max-w-[425px]">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xóa mã giảm giá</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa mã giảm giá "{coupon.ma_code}"? Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteCoupon.mutate(coupon.id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
