'use client';

import { useAdminOrders } from "@/hooks/useAdminOrders";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { useState, useMemo } from "react";
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
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    Calendar as CalendarIcon,
    CreditCard,
    ClipboardList,
    FilterX,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

import { OrderDetailModal } from "@/components/admin/OrderDetailModal";

const ORDER_STATUSES = {
    'cho_xac_nhan': { label: 'Chờ xác nhận', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    'da_xac_nhan': { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    'dang_xu_ly': { label: 'Đang xử lý', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    'dang_giao': { label: 'Đang giao', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    'da_giao': { label: 'Đã giao', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    'da_huy': { label: 'Đã hủy', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    'hoan_tra': { label: 'Hoàn trả', color: 'bg-slate-50 text-slate-600 border-slate-100' },
};

const PAYMENT_METHODS = {
    'cod': { label: 'COD (Tiền mặt)', icon: '💵' },
    'vnpay': { label: 'VNPay', icon: '💳' },
    'momo': { label: 'MoMo', icon: '📱' },
};

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [paymentMethod, setPaymentMethod] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const params = useMemo(() => ({
        page,
        tu_khoa: search || undefined,
        trang_thai: status === 'all' ? undefined : status,
        phuong_thuc_tt: paymentMethod === 'all' ? undefined : paymentMethod,
        tu_ngay: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        den_ngay: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    }), [page, search, status, paymentMethod, dateRange]);

    const { data: response, isLoading, error } = useAdminOrders(params);

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Đơn hàng" />;
    }
    const orders = response?.data || [];
    const meta = response?.meta;

    const hasActiveFilters = search || status !== 'all' || paymentMethod !== 'all' || dateRange;

    const resetFilters = () => {
        setSearch("");
        setStatus("all");
        setPaymentMethod("all");
        setDateRange(undefined);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
                    <p className="text-slate-500 text-sm italic">Theo dõi, cập nhật trạng thái và xử lý đơn hàng toàn hệ thống.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    className={cn("border-slate-200", hasActiveFilters && "border-rose-200 text-rose-600 hover:bg-rose-50")}
                >
                    <FilterX className="h-4 w-4 mr-2" /> Xóa bộ lọc
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
                {/* Row 1: Search + Status + Payment */}
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Mã đơn hàng, tên hoặc SĐT khách hàng..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
                        />
                    </div>

                    <div className="w-full md:w-52">
                        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                            <SelectTrigger className="bg-slate-50 border-none">
                                <SelectValue placeholder="Trạng thái đơn hàng" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full md:w-52">
                        <Select value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v); setPage(1); }}>
                            <SelectTrigger className="bg-slate-50 border-none">
                                <CreditCard className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Phương thức TT" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                                {Object.entries(PAYMENT_METHODS).map(([key, { label, icon }]) => (
                                    <SelectItem key={key} value={key}>
                                        <span className="mr-1.5">{icon}</span>{label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Row 2: Date Range */}
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex-1 md:w-[320px] md:flex-none justify-start text-left font-normal bg-slate-50 border-none hover:bg-slate-100 text-slate-700",
                                    !dateRange && "text-slate-400"
                                )}
                            >
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <span className="font-medium text-slate-700">
                                            {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} — {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                                        </span>
                                    ) : (
                                        <span className="text-rose-500 font-medium">
                                            {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} — (chọn ngày kết thúc)
                                        </span>
                                    )
                                ) : (
                                    "Lọc theo khoảng ngày đặt hàng..."
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-0"
                            align="start"
                            sideOffset={8}
                            avoidCollisions
                            style={{ zIndex: 9999 }}
                        >
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={(range) => { setDateRange(range); setPage(1); }}
                                numberOfMonths={2}
                                locale={vi}
                            />
                        </PopoverContent>
                    </Popover>
                    {dateRange && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-slate-400 hover:text-rose-500"
                            onClick={() => { setDateRange(undefined); setPage(1); }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Orders Table */}
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
                                    <TableHead className="font-bold">Mã đơn</TableHead>
                                    <TableHead className="font-bold">Khách hàng</TableHead>
                                    <TableHead className="font-bold">Ngày đặt</TableHead>
                                    <TableHead className="font-bold">Tổng tiền</TableHead>
                                    <TableHead className="font-bold">Thanh toán</TableHead>
                                    <TableHead className="font-bold">Trạng thái</TableHead>
                                    <TableHead className="text-right font-bold">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? orders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="font-mono font-bold text-primary">
                                            #{order.ma_don_hang}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{order.ten_nguoi_nhan}</span>
                                                <span className="text-[10px] text-slate-400">{order.sdt_nguoi_nhan}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                                                <span className="text-sm">
                                                    {formatDate(order.created_at)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900">
                                                {formatCurrency(order.tong_tien)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize font-medium text-[10px] border-slate-200 bg-slate-50">
                                                <CreditCard className="h-3 w-3 mr-1 text-slate-400" />
                                                {order.phuong_thuc_tt?.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`border ${ORDER_STATUSES[order.trang_thai as keyof typeof ORDER_STATUSES]?.color || 'bg-slate-50'}`}>
                                                {ORDER_STATUSES[order.trang_thai as keyof typeof ORDER_STATUSES]?.label || order.trang_thai}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-primary/10 hover:text-primary rounded-full"
                                                onClick={() => {
                                                    setSelectedOrderId(order.id);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center text-slate-400 italic">
                                            <div className="flex flex-col items-center gap-2">
                                                <ClipboardList className="h-8 w-8 text-slate-200" />
                                                <p>Không tìm thấy đơn hàng nào phù hợp</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {meta && meta.last_page > 1 && (
                            <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-[10px] text-slate-500 italic">
                                    Hiển thị <strong>{orders.length}</strong> trên tổng số <strong>{meta.total}</strong> đơn hàng
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

            <OrderDetailModal
                orderId={selectedOrderId}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
