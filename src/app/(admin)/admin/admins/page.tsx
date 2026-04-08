'use client';

import { useState } from "react";
import { useAdminUsers, useCreateUser } from "@/hooks/useAdminUsers";
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
    Activity,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const createUserSchema = z.object({
    ho_va_ten: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    mat_khau: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    so_dien_thoai: z.string().optional().or(z.literal("")),
    vai_tro: z.string().min(1, "Vai trò là bắt buộc"),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function AdminManagementPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const roleFilter = "quan_tri";
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data: response, isLoading, error } = useAdminUsers({
        page,
        search: search || undefined,
        vai_tro: roleFilter
    });

    const createUser = useCreateUser();

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            ho_va_ten: "",
            email: "",
            mat_khau: "",
            so_dien_thoai: "",
            vai_tro: "quan_tri",
        },
    });

    if ((error as any)?.status === 403) {
        return <AccessDenied moduleName="Quản lý nhân viên" />;
    }

    const users = response?.data || [];
    const meta = response?.meta;

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    const onAddSubmit = async (values: CreateUserFormValues) => {
        await createUser.mutateAsync(values);
        setIsAddOpen(false);
        form.reset();
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/10 rounded-2xl shadow-sm border border-amber-500/5">
                            <Shield className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Quản Lý Nhân Viên</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                <Users className="h-4 w-4 text-amber-600/60" />
                                Thiết lập quyền hạn và quản lý tài khoản quản trị hệ thống
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-slate-200"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm nhân viên
                    </Button>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-black">
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input
                        placeholder="Tìm kiếm theo tên, email nhân viên..."
                        autoComplete="off"
                        className="w-full pl-11 h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold focus-visible:ring-amber-500/20 focus-visible:border-amber-500/30 outline-none transition-all px-4"
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
                        <Loader2 className="h-12 w-12 animate-spin text-amber-500/30" />
                        <Activity className="h-6 w-6 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-[10px]">Đang truy xuất danh sách nhân viên...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <UserTable users={users} onEdit={handleEditClick} />

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Trang {meta.current_page} / {meta.last_page} • {meta.total} nhân viên
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
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                user={selectedUser}
            />

            {/* Add User Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Thêm nhân viên mới</DialogTitle>
                        <DialogDescription>
                            Tạo tài khoản nhân viên mới cho hệ thống. Mật khẩu sẽ được cấp mặc định.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="ho_va_ten"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nguyễn Văn A" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin@example.com" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mat_khau"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="so_dien_thoai"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="09xxxxxxx" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={createUser.isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
                                    {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Tạo tài khoản
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
