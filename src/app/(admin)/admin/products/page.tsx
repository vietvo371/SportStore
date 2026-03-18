'use client';

import { useAdminProducts, useAdminMetadata } from "@/hooks/useAdmin";
import { adminService, adminKeys } from "@/services/admin.service";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    Archive,
    FolderOpen,
    CornerDownRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useState, useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/product.types";
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

export default function AdminProductsPage() {
    // Filter states
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string>("all");
    const [brandId, setBrandId] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("moi_nhat");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { categories, brands } = useAdminMetadata();

    // Construct params for query
    const params = useMemo(() => ({
        page,
        tu_khoa: search || undefined,
        danh_muc_id: categoryId === 'all' ? undefined : categoryId,
        thuong_hieu_id: brandId === 'all' ? undefined : brandId,
        trang_thai: status === 'all' ? undefined : (status === 'active' ? 1 : 0),
        sap_xep: sortBy
    }), [page, search, categoryId, brandId, status, sortBy]);

    const { data: response, isLoading, error } = useAdminProducts(params);

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Sản phẩm" />;
    }
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...adminKeys.all, 'products'] });
            toast.success("Xóa sản phẩm thành công");
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa sản phẩm");
        }
    });

    const resetFilters = () => {
        setSearch("");
        setCategoryId("all");
        setBrandId("all");
        setStatus("all");
        setSortBy("moi_nhat");
        setPage(1);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId);
            setDeleteId(null);
        }
    };

    const products = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h1>
                    <p className="text-slate-500 text-sm italic">Quản lý kho hàng, biến thể và cấu hình hiển thị.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={resetFilters} className="border-slate-200">
                        <X className="h-4 w-4 mr-2" /> Làm mới
                    </Button>
                    <Button asChild className="shadow-lg shadow-primary/20">
                        <Link href="/admin/products/new">
                            <Plus className="h-4 w-4 mr-2" /> Thêm sản phẩm
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Mã SKU hoặc tên sản phẩm..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-52">
                        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(1); }}>
                            <SelectTrigger className="bg-slate-50 border-none">
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                                <SelectItem value="all">Tất cả danh mục</SelectItem>
                                <SelectSeparator />
                                {(categories as Category[]).map((parent, idx) => {
                                    const children = parent.danh_muc_con ?? [];
                                    const isLast = idx === (categories as Category[]).length - 1;
                                    if (children.length > 0) {
                                        return (
                                            <SelectGroup key={parent.id}>
                                                <SelectLabel className="flex items-center gap-1.5 px-2 py-2 text-xs font-bold text-primary bg-primary/5 border-b border-primary/10 -mx-1 mb-1">
                                                    <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                                                    {parent.ten}
                                                </SelectLabel>
                                                {children.map((child) => (
                                                    <SelectItem
                                                        key={child.id}
                                                        value={child.id.toString()}
                                                        className="pl-7 text-sm text-slate-700 focus:bg-primary/10 focus:text-primary"
                                                    >
                                                        <span className="flex items-center gap-1.5">
                                                            <CornerDownRight className="h-3 w-3 text-slate-400 shrink-0" />
                                                            {child.ten}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                                {!isLast && <SelectSeparator className="mt-1" />}
                                            </SelectGroup>
                                        );
                                    }
                                    return (
                                        <SelectItem key={parent.id} value={parent.id.toString()} className="font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <FolderOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                {parent.ten}
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Brand Filter */}
                    <div className="w-full md:w-48">
                        <Select value={brandId} onValueChange={(v) => { setBrandId(v); setPage(1); }}>
                            <SelectTrigger className="bg-slate-50 border-none">
                                <SelectValue placeholder="Thương hiệu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                                {brands.map((b: any) => (
                                    <SelectItem key={b.id} value={b.id.toString()}>{b.ten}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full md:w-40">
                        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                            <SelectTrigger className="bg-slate-50 border-none">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="active">Đang mở bán</SelectItem>
                                <SelectItem value="hidden">Đang ẩn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort */}
                    <div className="w-full md:w-40">
                        <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
                            <SelectTrigger className="bg-slate-50 border-none">
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="moi_nhat">Mới nhất</SelectItem>
                                <SelectItem value="gia_tang">Giá tăng dần</SelectItem>
                                <SelectItem value="gia_giam">Giá giảm dần</SelectItem>
                                <SelectItem value="ban_chay">Bán chạy</SelectItem>
                                <SelectItem value="ton_kho">Tồn kho thấp nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Ảnh</TableHead>
                                    <TableHead>Thông tin sản phẩm</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                    <TableHead>Giá (VND)</TableHead>
                                    <TableHead>Kho hàng</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length > 0 ? products.map((product) => {
                                    // Calculate total stock from variants
                                    const totalStock = product.bien_the?.reduce((acc, variant) => acc + (variant.ton_kho || 0), 0) || 0;

                                    return (
                                        <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <TableCell>
                                                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 group-hover:border-primary/20 transition-colors">
                                                    <Image
                                                        src={product.anh_chinh?.url || product.hinh_anh?.[0]?.url || product.hinh_anh_san_pham?.[0]?.url || '/placeholder.png'}
                                                        alt={product.ten_san_pham}
                                                        fill
                                                        unoptimized
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                                        {product.ten_san_pham}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {product.ma_sku && (
                                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">
                                                                {product.ma_sku}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase line-clamp-1">
                                                            ID: {product.id} • Slug: {product.duong_dan}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium w-fit">
                                                        {product.danh_muc?.ten}
                                                    </Badge>
                                                    {product.thuong_hieu && (
                                                        <span className="text-[10px] text-slate-400 italic ml-1">
                                                            Brand: {product.thuong_hieu.ten}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary">
                                                        {formatCurrency(product.gia_khuyen_mai || product.gia_goc)}
                                                    </span>
                                                    {product.gia_khuyen_mai && (
                                                        <span className="text-[10px] text-slate-400 line-through">
                                                            {formatCurrency(product.gia_goc)}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Archive className="h-3 w-3 text-slate-400" />
                                                        <span className={`font-bold text-sm ${totalStock <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                                                            {totalStock}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        {product.bien_the?.length || 0} phân loại
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={product.trang_thai
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                                                    : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"}>
                                                    {product.trang_thai ? 'Đang mở bán' : 'Bản nháp/Ẩn'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 shadow-xl border-slate-100">
                                                        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 px-2 py-1.5 font-bold tracking-widest">Hành động</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/products/${product.duong_dan}`} target="_blank" className="flex items-center py-2">
                                                                <Eye className="mr-2 h-4 w-4 text-slate-400" /> Xem trên Shop
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/products/${product.id}`} className="flex items-center py-2">
                                                                <Edit className="mr-2 h-4 w-4 text-slate-400" /> Chỉnh sửa sản phẩm
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer py-2"
                                                            onClick={() => handleDelete(product.id)}
                                                            disabled={deleteMutation.isPending}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Xóa sản phẩm
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center text-slate-400 italic">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="h-8 w-8 text-slate-200" />
                                                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc</p>
                                                <Button variant="link" onClick={resetFilters} className="text-primary h-auto p-0">
                                                    Xóa tất cả bộ lọc
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {meta && meta.last_page > 1 && (
                            <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-slate-500 italic">
                                    Hiển thị <strong>{products.length}</strong> trên tổng số <strong>{meta.total}</strong> sản phẩm
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg"
                                        disabled={page === 1}
                                        onClick={() => {
                                            setPage(p => p - 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-1 px-4 text-sm font-bold text-slate-700">
                                        Trang {page} / {meta.last_page}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg"
                                        disabled={page === meta.last_page}
                                        onClick={() => {
                                            setPage(p => p + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-900">Xác nhận xóa sản phẩm?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống và không còn hiển thị trên cửa hàng.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50">Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Xác nhận xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
