"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Edit,
    Trash2,
    Shield,
    MoreHorizontal,
    ExternalLink,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBrand } from "@/hooks/useAdminCatalog";

interface BrandTableProps {
    brands: any[];
    onEdit: (brand: any) => void;
}

export function BrandTable({ brands, onEdit }: BrandTableProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const deleteMutation = useDeleteBrand();

    const handleDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Tên thương hiệu</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {brands && brands.length > 0 ? (
                            brands.map((brand) => (
                                <TableRow key={brand.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="w-12 text-center">
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{brand.ten}</p>
                                                <p className="text-xs text-slate-500">{brand.duong_dan}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[300px]">
                                            {brand.mo_ta || "Chưa có mô tả chi tiết cho thương hiệu này."}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`font-medium w-fit border-none ${brand.trang_thai
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {brand.trang_thai ? "Hoạt động" : "Ẩn"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 border-slate-100">
                                                <DropdownMenuLabel className="text-xs text-slate-500 font-medium">Thao tác</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onEdit(brand)} className="flex items-center gap-2 cursor-pointer">
                                                    <Edit className="h-4 w-4 text-blue-500" />
                                                    <span className="font-bold text-sm">Chỉnh sửa</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setDeleteId(brand.id)} className="flex items-center gap-2 cursor-pointer text-rose-600 focus:text-rose-600">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="font-bold text-sm">Xóa</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Shield className="h-8 w-8 text-slate-200" />
                                        <p>Chưa có thương hiệu nào</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-900">Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            Bạn có chắc chắn muốn xóa thương hiệu này? Hành động này có thể ảnh hưởng đến các sản phẩm thuộc thương hiệu này và không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200"
                        >
                            Xác nhận xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
