'use client';

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { UserTable } from "@/components/admin/UserTable";
import { UserEditDialog } from "@/components/admin/UserEditDialog";
import { AccessDenied } from "@/components/admin/AccessDenied";
import {
    Users,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    UserCheck,
    Shield,
    Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function UserManagementPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const roleFilter = "khach_hang";
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data: response, isLoading, error } = useAdminUsers({
        page,
        search: search || undefined,
        vai_tro: roleFilter
    });

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý Khách hàng" />;
    }

    const users = response?.data || [];
    const meta = response?.meta;

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl shadow-sm border border-primary/5">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Quản Lý Khách Hàng</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                <Shield className="h-4 w-4 text-primary/60" />
                                Quản lý thông tin và trạng thái tài khoản khách hàng
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-black">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tổng cộng</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{meta?.total || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Tìm kiếm theo tên, email hoặc số điện thoại khách hàng..."
                        autoComplete="off"
                        className="w-full pl-11 h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold focus-visible:ring-primary/20 focus-visible:border-primary/30 outline-none transition-all px-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 font-black text-xs uppercase tracking-widest hover:bg-slate-50 gap-2 shrink-0 text-slate-600">
                    <Filter className="h-4 w-4" />
                    Lọc nâng cao
                </Button>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
                        <Activity className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-[10px]">Đang truy xuất danh sách khách hàng...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <UserTable users={users} onEdit={handleEditClick} hideDelete={true} />

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Trang {meta.current_page} / {meta.last_page} • {meta.total} người dùng
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-11 rounded-1.5xl px-5 border-slate-100 font-black text-[10px] uppercase tracking-wider disabled:opacity-30 transition-all active:scale-95"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-11 rounded-1.5xl px-5 border-slate-100 font-black text-[10px] uppercase tracking-wider disabled:opacity-30 transition-all active:scale-95 text-slate-900"
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={page === meta.last_page}
                                >
                                    Sau <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <UserEditDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
            />
        </div>
    );
}
