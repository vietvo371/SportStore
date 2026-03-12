'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldCheck, Search } from "lucide-react";
import { Role, Permission } from "@/types/auth.types";
import { useAdminRoles } from "@/hooks/useAdminRoles";

interface RoleDialogProps {
    role: Role | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RoleDialog({ role, isOpen, onClose }: RoleDialogProps) {
    const { permissions, createRole, updateRole, isCreating, isUpdating, isLoadingPermissions } = useAdminRoles();
    
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (role) {
            setName(role.ten);
            setSlug(role.ma_slug);
            setSelectedPermissions(role.quyen?.map(p => p.id) || []);
        } else {
            setName('');
            setSlug('');
            setSelectedPermissions([]);
        }
    }, [role, isOpen]);

    const handleSave = async () => {
        if (role) {
            await updateRole({ 
                id: role.id, 
                data: { ten: name, ma_slug: slug, quyen_ids: selectedPermissions } 
            });
        } else {
            await createRole({ 
                ten: name, 
                ma_slug: slug, 
                quyen_ids: selectedPermissions 
            });
        }
        onClose();
    };

    const togglePermission = (id: number) => {
        setSelectedPermissions(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleGroup = (groupPermissions: Permission[]) => {
        const groupIds = groupPermissions.map(p => p.id);
        const allSelected = groupIds.every(id => selectedPermissions.includes(id));
        
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !groupIds.includes(id)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...groupIds])]);
        }
    };

    const isGroupSelected = (groupPermissions: Permission[]) => {
        return groupPermissions.map(p => p.id).every(id => selectedPermissions.includes(id));
    };

    const filteredPermissions = Object.entries(permissions).reduce((acc, [group, perms]) => {
        const matching = perms.filter(p => 
            p.ten.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.ma_slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matching.length > 0) acc[group] = matching;
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        {role ? 'Cập nhật Vai trò' : 'Thêm Vai trò mới'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên vai trò</Label>
                            <Input 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Ví dụ: Quản lý kho"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Mã (Slug)</Label>
                            <Input 
                                id="slug" 
                                value={slug} 
                                onChange={(e) => setSlug(e.target.value)} 
                                placeholder="Ví dụ: manager"
                                disabled={role?.ma_slug === 'super_admin'}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Quyền hạn</Label>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Tìm quyền..." 
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {isLoadingPermissions ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(filteredPermissions).map(([group, perms]) => (
                                    <div key={group} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h3 className="font-bold text-sm text-primary uppercase tracking-wider">{group}</h3>
                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs cursor-pointer" htmlFor={`group-${group}`}>Chọn tất cả</Label>
                                                <Checkbox 
                                                    id={`group-${group}`}
                                                    checked={isGroupSelected(perms)}
                                                    onCheckedChange={() => toggleGroup(perms)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {perms.map((p) => (
                                                <div key={p.id} className="flex items-center justify-between p-2 rounded hover:bg-background transition-colors">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-sm font-medium cursor-pointer" htmlFor={`p-${p.id}`}>
                                                            {p.ten}
                                                        </Label>
                                                        <p className="text-[10px] text-muted-foreground font-mono">{p.ma_slug}</p>
                                                    </div>
                                                    <Checkbox 
                                                        id={`p-${p.id}`}
                                                        checked={selectedPermissions.includes(p.id)}
                                                        onCheckedChange={() => togglePermission(p.id)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 border-t bg-muted/20">
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {role ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
