'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Ruler, User, Footprints } from "lucide-react";
import { useDeleteSizeChart } from "@/hooks/useAdminSizeCharts";
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

interface BangSizeTableProps {
    items: any[];
    onEdit: (item: any) => void;
}

export function BangSizeTable({ items, onEdit }: BangSizeTableProps) {
    const deleteSizeChart = useDeleteSizeChart();

    const handleDelete = async (id: number) => {
        await deleteSizeChart.mutateAsync(id);
    };

    if (items.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                <Ruler className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Chưa có quy tắc size nào</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                    Hãy thêm quy tắc đầu tiên để Chatbot có thể tư vấn cho khách hàng.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[150px] font-bold text-slate-700">Thương hiệu</TableHead>
                        <TableHead className="w-[100px] font-bold text-slate-700">Loại</TableHead>
                        <TableHead className="w-[100px] font-bold text-slate-700 text-center">Size</TableHead>
                        <TableHead className="font-bold text-slate-700">Thông số quy đổi</TableHead>
                        <TableHead className="w-[120px] text-right font-bold text-slate-700">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                            <TableCell>
                                {item.thuong_hieu ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                                            {item.thuong_hieu.hinh_anh ? (
                                                <img src={item.thuong_hieu.hinh_anh} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                item.thuong_hieu.ten.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <span className="font-semibold text-slate-900">{item.thuong_hieu.ten}</span>
                                    </div>
                                ) : (
                                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium">Dùng chung</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {item.loai === 'giay' ? (
                                        <Footprints className="h-4 w-4 text-amber-500" />
                                    ) : (
                                        <User className="h-4 w-4 text-blue-500" />
                                    )}
                                    <span className="capitalize text-slate-600 font-medium">
                                        {item.loai === 'ao' ? 'Áo' : item.loai === 'quan' ? 'Quần' : 'Giầy'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className="inline-flex items-center justify-center h-8 min-w-[32px] px-2 rounded-lg bg-slate-900 text-white text-xs font-black ring-4 ring-slate-100">
                                    {item.ten_size}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {item.loai === 'giay' ? (
                                        <div className="text-sm text-slate-600">
                                            Dài chân: <span className="font-bold text-slate-900">{item.chieu_dai_chan_min} - {item.chieu_dai_chan_max} mm</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                                            {item.chieu_cao_min > 0 && (
                                                <span>Cao: <span className="font-bold text-slate-900">{item.chieu_cao_min} - {item.chieu_cao_max} cm</span></span>
                                            )}
                                            {item.can_nang_min > 0 && (
                                                <span>Nặng: <span className="font-bold text-slate-900">{item.can_nang_min} - {item.can_nang_max} kg</span></span>
                                            )}
                                        </div>
                                    )}
                                    {item.mo_ta && <p className="text-[11px] text-slate-400 italic font-medium">{item.mo_ta}</p>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                                        onClick={() => onEdit(item)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-xl font-bold">Xác nhận xóa</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa quy tắc size <span className="font-bold text-slate-950">"{item.ten_size}"</span> này không? 
                                                    Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl border-slate-200">Hủy</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Xóa quy tắc
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
