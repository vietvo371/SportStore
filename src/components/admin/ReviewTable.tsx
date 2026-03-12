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
    Star,
    CheckCircle2,
    Trash2,
    User,
    Package,
    Calendar,
    MessageSquare,
    AlertCircle,
    Loader2
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useApproveReview, useDeleteReview } from "@/hooks/useAdminReviews";
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

interface ReviewTableProps {
    reviews: any[];
}

export function ReviewTable({ reviews }: ReviewTableProps) {
    const approveReview = useApproveReview();
    const deleteReview = useDeleteReview();

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[25%] text-left">Khách hàng / Sản phẩm</TableHead>
                        <TableHead className="py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[10%]">Đánh giá</TableHead>
                        <TableHead className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[35%]">Nội dung</TableHead>
                        <TableHead className="py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Trạng thái</TableHead>
                        <TableHead className="py-5 px-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                    <MessageSquare className="h-10 w-10 opacity-20" />
                                    <p className="font-medium">Chưa có đánh giá nào</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        reviews.map((review) => (
                            <TableRow key={review.id} className="hover:bg-slate-50/30 transition-colors border-slate-50 last:border-0 group">
                                <TableCell className="py-6 px-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs shrink-0">
                                                {review.nguoi_dung?.ten?.charAt(0) || <User className="h-4 w-4" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">{review.nguoi_dung?.ten || 'Ẩn danh'}</span>
                                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                                                    <Calendar className="h-3 w-3" /> {formatDate(review.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-xl border border-primary/10 w-fit max-w-full">
                                            <Package className="h-3 w-3 text-primary shrink-0" />
                                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">
                                                {review.san_pham?.ten_san_pham}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-sm font-black text-slate-900">{review.so_sao}/5</span>
                                        {renderStars(review.so_sao)}
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="space-y-2 max-w-md">
                                        {review.tieu_de && (
                                            <p className="font-bold text-slate-900 text-sm leading-tight">{review.tieu_de}</p>
                                        )}
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic line-clamp-3">
                                            "{review.noi_dung || 'Không có nội dung'}"
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    {review.da_duyet ? (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                                            Đã duyệt
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                                            Chờ duyệt
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="py-6 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!review.da_duyet && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 rounded-lg px-3 bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-bold text-[11px] uppercase tracking-wide gap-1.5"
                                                onClick={() => approveReview.mutate(review.id)}
                                                disabled={approveReview.isPending}
                                            >
                                                {approveReview.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                                Duyệt
                                            </Button>
                                        )}

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                                <AlertDialogHeader>
                                                    <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
                                                        <AlertCircle className="h-6 w-6" />
                                                    </div>
                                                    <AlertDialogTitle className="text-xl font-black text-slate-900 tracking-tight">Xoá đánh giá này?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
                                                        Hành động này không thể hoàn tác. Đánh giá này sẽ bị xoá vĩnh viễn khỏi hệ thống.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="mt-6 gap-3">
                                                    <AlertDialogCancel className="rounded-2xl border-slate-100 font-bold text-slate-500">Hủy bỏ</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-white shadow-lg shadow-rose-200"
                                                        onClick={() => deleteReview.mutate(review.id)}
                                                    >
                                                        Xác nhận xoá
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
