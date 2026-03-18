"use client";

import React from "react";
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
    ChevronRight,
    ChevronDown,
    Layers,
    MoreHorizontal,
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
import { useDeleteCategory } from "@/hooks/useAdminCatalog";

interface CategoryTableProps {
    categories: any[];
    onEdit: (category: any) => void;
}

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const deleteMutation = useDeleteCategory();

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const renderRows = (items: any[], depth = 0) => {
        return items.map((category) => (
            <React.Fragment key={category.id}>
                <TableRow className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="w-12 text-center">
                        {category.danh_muc_con && category.danh_muc_con.length > 0 ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleExpand(category.id)}
                            >
                                {expandedIds.includes(category.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        ) : null}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3" style={{ paddingLeft: `${depth * 24}px` }}>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${depth === 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                <Layers className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{category.ten}</p>
                                <p className="text-xs text-slate-500">{category.duong_dan}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge
                            variant="secondary"
                            className={`font-medium w-fit border-none ${category.trang_thai
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            {category.trang_thai ? "Hoạt động" : "Ẩn"}
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
                                <DropdownMenuItem onClick={() => onEdit(category)} className="flex items-center gap-2 cursor-pointer">
                                    <Edit className="h-4 w-4 text-blue-500" />
                                    <span className="font-bold text-sm">Chỉnh sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeleteId(category.id)} className="flex items-center gap-2 cursor-pointer text-rose-600 focus:text-rose-600">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="font-bold text-sm">Xóa</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                {expandedIds.includes(category.id) &&
                    category.danh_muc_con &&
                    renderRows(category.danh_muc_con, depth + 1)}
            </React.Fragment>
        ));
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Tên danh mục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length > 0 ? (
                            renderRows(categories)
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Layers className="h-8 w-8 text-slate-200" />
                                        <p>Chưa có danh mục nào</p>
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
                            Bạn có chắc chắn muốn xóa danh mục này? Hành động này có thể ảnh hưởng đến các sản phẩm thuộc danh mục này và không thể hoàn tác.
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
