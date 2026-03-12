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
    Users,
    Edit,
    Trash2,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Mail,
    Phone,
    Crown
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useDeleteUser } from "@/hooks/useAdminUsers";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserTableProps {
    users: any[];
    onEdit: (user: any) => void;
}

export function UserTable({ users, onEdit }: UserTableProps) {
    const deleteUser = useDeleteUser();

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-200/50">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[30%]">Thông tin người dùng</TableHead>
                        <TableHead className="py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Vai trò</TableHead>
                        <TableHead className="py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Ngày tham gia</TableHead>
                        <TableHead className="py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Trạng thái</TableHead>
                        <TableHead className="py-6 px-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-80 text-center">
                                <div className="flex flex-col items-center justify-center gap-3 text-slate-300">
                                    <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center">
                                        <Users className="h-8 w-8 opacity-20" />
                                    </div>
                                    <p className="font-black uppercase tracking-widest text-[11px]">Không tìm thấy người dùng nào</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-all border-slate-50 last:border-0 group">
                                <TableCell className="py-6 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-lg font-black border border-slate-200 overflow-hidden shrink-0">
                                            {user.anh_dai_dien ? (
                                                <img src={user.anh_dai_dien} alt={user.ho_va_ten} className="h-full w-full object-cover" />
                                            ) : (
                                                user.ho_va_ten?.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-slate-900 tracking-tight text-base truncate">{user.ho_va_ten}</span>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 truncate">
                                                    <Mail className="h-3 w-3" /> {user.email}
                                                </span>
                                                {user.so_dien_thoai && (
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 truncate">
                                                        <Phone className="h-3 w-3" /> {user.so_dien_thoai}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    {user.is_master ? (
                                        <Badge variant="secondary" className="bg-rose-100 text-rose-800 hover:bg-rose-100 flex items-center gap-1">
                                            <Crown className="h-3 w-3" /> Master
                                        </Badge>
                                    ) : user.vai_tro === 'quan_tri' ? (
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                            Admin
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                            User
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{formatDate(user.batch_dau_luc || user.created_at)}</span>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                    {user.trang_thai ? (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                            Hoạt động
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                                            Đã khoá
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="py-6 px-8 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-10 w-10 rounded-xl p-0 hover:bg-slate-100 text-slate-600 shadow-sm transition-all active:scale-95"
                                                        onClick={() => onEdit(user)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 border-slate-800 text-white font-bold text-[10px] uppercase tracking-wider py-2 px-3">Cấu hình</TooltipContent>
                                            </Tooltip>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled={user.is_master}
                                                        className="h-10 w-10 rounded-xl p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-all active:scale-95 disabled:opacity-30"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xoá người dùng này?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tài khoản của <span className="font-medium text-slate-900">"{user.ho_va_ten}"</span> sẽ bị xoá vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-rose-500 hover:bg-rose-600 text-white"
                                                            onClick={() => deleteUser.mutate(user.id)}
                                                        >
                                                            Xác nhận xoá
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TooltipProvider>
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
