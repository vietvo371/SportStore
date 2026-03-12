'use client';

import { useState } from 'react';
import { useAdminRoles } from "@/hooks/useAdminRoles";
import { 
    ShieldAlert, 
    Plus, 
    Edit, 
    Trash2, 
    Loader2, 
    ShieldCheck, 
    Users,
    Key,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RoleDialog } from "@/components/admin/RoleDialog";
import { Role } from '@/types/auth.types';
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

export default function RolesPage() {
    const { 
        roles, 
        isLoadingRoles, 
        permissions, 
        isLoadingPermissions, 
        deleteRole, 
        isDeleting 
    } = useAdminRoles();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingRole(null);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (deletingRoleId) {
            await deleteRole(deletingRoleId);
            setDeletingRoleId(null);
        }
    };

    const totalPermissions = Object.values(permissions || {}).reduce((acc: number, curr: any) => acc + (curr?.length || 0), 0);

    if (isLoadingRoles || isLoadingPermissions) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vai trò & Quyền hạn</h1>
                    <p className="text-muted-foreground">Quản lý các cấp bậc truy cập và quyền hạn của nhân viên.</p>
                </div>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm vai trò
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            Tổng số vai trò
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{roles.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Key className="w-4 h-4 text-blue-500" />
                            Quyền hệ thống
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPermissions}</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-500/5 border-orange-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-500" />
                            Nhân viên đã gán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách vai trò</CardTitle>
                    <CardDescription>Các vai trò được định nghĩa trong hệ thống RBAC.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Mã (Slug)</TableHead>
                                <TableHead>Quyền hạn</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            {role.ma_slug === 'super_admin' ? (
                                                <Badge variant="default" className="bg-primary hover:bg-primary">
                                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                                    {role.ten}
                                                </Badge>
                                            ) : (
                                                role.ten
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{role.ma_slug}</code>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[400px]">
                                            {role.ma_slug === 'super_admin' ? (
                                                <Badge variant="outline" className="text-primary border-primary/30">Tất cả quyền hạn</Badge>
                                            ) : (
                                                <>
                                                    {role.quyen?.slice(0, 5).map(p => (
                                                        <Badge key={p.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                                            {p.ten}
                                                        </Badge>
                                                    ))}
                                                    {(role.quyen?.length || 0) > 5 && (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                            +{(role.quyen?.length || 0) - 5} khác
                                                        </Badge>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEdit(role)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                {role.ma_slug !== 'super_admin' && role.ma_slug !== 'customer' && (
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeletingRoleId(role.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Xóa vai trò
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <RoleDialog 
                role={editingRole}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />

            <AlertDialog open={!!deletingRoleId} onOpenChange={(open) => !open && setDeletingRoleId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-destructive" />
                            Xác nhận xóa vai trò?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Tất cả người dùng đang gán vai trò này sẽ bị mất các quyền hạn liên quan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Xóa ngay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
