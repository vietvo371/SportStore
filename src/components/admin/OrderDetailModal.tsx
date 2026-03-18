'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    User,
    Phone,
    CreditCard,
    History,
    FileText,
    Loader2
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/useAdminOrders";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface OrderDetailModalProps {
    orderId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
    'cho_xac_nhan': 'Chờ xác nhận',
    'da_xac_nhan': 'Đã xác nhận',
    'dang_xu_ly': 'Đang xử lý',
    'dang_giao': 'Đang giao',
    'da_giao': 'Đã giao',
    'da_huy': 'Đã hủy',
    'hoan_tra': 'Hoàn trả',
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'cho_xac_nhan': return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
        case 'da_xac_nhan': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100';
        case 'dang_xu_ly': return 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
        case 'dang_giao': return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100';
        case 'da_giao': return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
        case 'da_huy': return 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100';
        case 'hoan_tra': return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
        default: return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
};

export function OrderDetailModal({ orderId, open, onOpenChange }: OrderDetailModalProps) {
    const { data: response, isLoading } = useAdminOrder(orderId);
    const updateStatus = useUpdateOrderStatus();

    const [newStatus, setNewStatus] = useState<string>("");
    const [note, setNote] = useState<string>("");

    const order = response?.data;

    useEffect(() => {
        if (order) {
            setNewStatus(order.trang_thai);
        }
    }, [order]);

    const handleUpdateStatus = () => {
        if (!orderId) return;
        updateStatus.mutate({
            id: orderId,
            data: { trang_thai: newStatus, ghi_chu: note }
        });
    };

    if (!orderId) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-5xl max-h-[92vh] overflow-y-auto p-0 border-none shadow-2xl rounded-2xl">
                <DialogHeader className="px-8 py-5 bg-slate-50/70 border-b border-slate-100 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                Chi tiết đơn hàng <span className="text-primary font-mono">#{order?.ma_don_hang}</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 mt-0.5 text-sm">
                                Đặt ngày: {order ? formatDate(order.created_at) : '...'}
                            </DialogDescription>
                        </div>
                        {order && (
                            <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-bold border text-sm ${getStatusBadgeClass(order.trang_thai)}`}>
                                {ORDER_STATUS_LABELS[order.trang_thai] || order.trang_thai}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="px-8 py-6 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column: Customer & Payment */}
                            <div className="space-y-5">
                                <section>
                                    <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-3 uppercase tracking-widest">
                                        <User className="h-3.5 w-3.5 text-primary" /> Thông tin khách hàng
                                    </h3>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">Người nhận</span>
                                            <span className="font-bold text-slate-900">{order.ten_nguoi_nhan}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">Số điện thoại</span>
                                            <span className="font-bold text-slate-900">{order.sdt_nguoi_nhan}</span>
                                        </div>
                                        <Separator className="bg-slate-200" />
                                        <div className="flex gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                            <span className="text-sm text-slate-600 leading-relaxed">
                                                {order.dia_chi_giao_hang}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-3 uppercase tracking-widest">
                                        <CreditCard className="h-3.5 w-3.5 text-primary" /> Thanh toán
                                    </h3>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">Phương thức</span>
                                            <Badge variant="secondary" className="uppercase text-xs font-bold px-3 py-1">
                                                {order.phuong_thuc_tt?.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">Trạng thái TT</span>
                                            <Badge variant="outline" className={`text-xs font-bold px-3 py-1 ${order.trang_thai_tt === 'da_thanh_toan' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-400'}`}>
                                                {order.trang_thai_tt === 'da_thanh_toan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </Badge>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Status Update */}
                            <section className="bg-primary/5 rounded-2xl p-6 border border-primary/10 h-fit">
                                <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-4 uppercase tracking-widest">
                                    <Truck className="h-3.5 w-3.5 text-primary" /> Quản lý đơn hàng
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Cập nhật trạng thái</label>
                                        <Select value={newStatus} onValueChange={setNewStatus}>
                                            <SelectTrigger className="bg-white border-slate-200 rounded-xl font-medium h-11">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent style={{ zIndex: 9999 }}>
                                                {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Ghi chú quản trị <span className="normal-case font-normal">(không bắt buộc)</span></label>
                                        <Textarea
                                            placeholder="Nhập ghi chú cho lần cập nhật này..."
                                            className="bg-white border-slate-200 rounded-xl resize-none text-sm h-28"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        className="w-full rounded-xl h-11 shadow-lg shadow-primary/20 font-bold"
                                        disabled={newStatus === order.trang_thai || updateStatus.isPending}
                                        onClick={handleUpdateStatus}
                                    >
                                        {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </section>
                        </div>

                        {/* Order Items Table */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                <Package className="h-4 w-4 text-primary" /> Danh sách sản phẩm
                            </h3>
                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                            <TableHead className="text-xs font-bold">Sản phẩm</TableHead>
                                            <TableHead className="text-xs font-bold text-center">Số lượng</TableHead>
                                            <TableHead className="text-xs font-bold text-right">Đơn giá</TableHead>
                                            <TableHead className="text-xs font-bold text-right">Thành tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item: any) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/30">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 line-clamp-1">{item.ten_san_pham}</span>
                                                        <span className="text-[10px] text-slate-400 italic">
                                                            Phân loại: {item.thong_tin_bien_the || 'Mặc định'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-slate-600">x{item.so_luong}</TableCell>
                                                <TableCell className="text-right text-sm">{formatCurrency(item.don_gia)}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">{formatCurrency(item.thanh_tien)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="bg-slate-50/50 font-bold">
                                            <TableCell colSpan={3} className="text-right uppercase text-[10px] text-slate-500">Tạm tính</TableCell>
                                            <TableCell className="text-right text-slate-900">{formatCurrency(order.tam_tinh)}</TableCell>
                                        </TableRow>
                                        <TableRow className="bg-slate-50/50 font-bold">
                                            <TableCell colSpan={3} className="text-right uppercase text-[10px] text-slate-500">Giảm giá</TableCell>
                                            <TableCell className="text-right text-rose-500">-{formatCurrency(order.so_tien_giam)}</TableCell>
                                        </TableRow>
                                        <TableRow className="bg-primary/5 text-primary text-base font-black">
                                            <TableCell colSpan={3} className="text-right uppercase text-xs tracking-widest">Tổng cộng</TableCell>
                                            <TableCell className="text-right">{formatCurrency(order.tong_tien)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </section>

                        {/* Status History Timeline */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                <History className="h-4 w-4 text-primary" /> Lịch sử đơn hàng
                            </h3>
                            <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-6">
                                {order.lich_su_trang_thai.map((history: any, index: number) => (
                                    <div key={history.id} className="relative flex gap-4">
                                        {index !== order.lich_su_trang_thai.length - 1 && (
                                            <div className="absolute left-[7px] top-4 w-[2px] h-full bg-slate-100" />
                                        )}
                                        <div className={`z-10 h-4 w-4 rounded-full border-4 border-white shadow-sm shrink-0 mt-1 ${index === 0 ? 'bg-primary' : 'bg-slate-300'}`} />
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={`text-[10px] font-black uppercase border ${getStatusBadgeClass(history.trang_thai)}`}>
                                                    {ORDER_STATUS_LABELS[history.trang_thai] || history.trang_thai}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400 italic">
                                                    {formatDate(history.created_at)}
                                                </span>
                                            </div>
                                            {history.ghi_chu && (
                                                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 inline-block w-full">
                                                    <FileText className="h-3 w-3 inline mr-1 text-slate-400" />
                                                    {history.ghi_chu}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
