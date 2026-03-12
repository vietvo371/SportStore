import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Image as ImageIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface BannerTableProps {
    banners: any[];
    isLoading: boolean;
    isError: boolean;
    meta?: any;
    onPageChange: (page: number) => void;
    onEdit: (banner: any) => void;
    onDelete: (banner: any) => void;
    onToggleStatus: (id: number) => void;
}

export function BannerTable({
    banners,
    isLoading,
    isError,
    meta,
    onPageChange,
    onEdit,
    onDelete,
    onToggleStatus
}: BannerTableProps) {
    if (isLoading) {
        return (
            <div className="p-8 text-center text-slate-500">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isError) {
        return <div className="p-8 text-center text-rose-500">Lỗi khi tải danh sách banner</div>;
    }

    if (banners.length === 0) {
        return (
            <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500">Không tìm thấy banner nào</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50 text-slate-600">
                        <TableHead className="w-[100px] text-center font-semibold">Hình ảnh</TableHead>
                        <TableHead className="font-semibold">Tiêu đề</TableHead>
                        <TableHead className="font-semibold">Đường dẫn</TableHead>
                        <TableHead className="text-center font-semibold w-[100px]">Thứ tự</TableHead>
                        <TableHead className="text-center font-semibold w-[120px]">Trạng thái</TableHead>
                        <TableHead className="text-right font-semibold w-[120px]">Khác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {banners.map((banner) => (
                        <TableRow key={banner.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="text-center">
                                <div className="h-10 w-24 relative rounded overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                                    {banner.url ? (
                                        <Image
                                            src={banner.url}
                                            alt={banner.tieu_de}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <ImageIcon className="h-4 w-4 text-slate-400" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                                {banner.tieu_de}
                            </TableCell>
                            <TableCell className="text-slate-500 max-w-[200px] truncate">
                                {banner.duong_dan || '-'}
                            </TableCell>
                            <TableCell className="text-center">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                    {banner.thu_tu}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <Switch
                                    checked={banner.trang_thai === 1}
                                    onCheckedChange={() => onToggleStatus(banner.id)}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => onEdit(banner)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                        onClick={() => onDelete(banner)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {meta && meta.last_page > 1 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm">
                    <p className="text-slate-500">
                        Hiển thị trang <span className="font-medium text-slate-900">{meta.current_page}</span> trên tổng <span className="font-medium text-slate-900">{meta.last_page}</span> trang
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.current_page === 1}
                            onClick={() => onPageChange(meta.current_page - 1)}
                            className="bg-white border-slate-200"
                        >
                            Trước
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.current_page === meta.last_page}
                            onClick={() => onPageChange(meta.current_page + 1)}
                            className="bg-white border-slate-200"
                        >
                            Sau
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
