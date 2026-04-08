'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress } from '@/hooks/useAddress';
import { Address } from '@/types/address.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, MapPin, Trash2, Edit2, ShieldCheck, ArrowLeft, Building2, Phone } from 'lucide-react';
import { AddressFormDialog } from '@/components/profile/AddressFormDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function AddressesPage() {
    const { addresses, isLoading, error, deleteAddress, isDeleting, updateAddress } = useAddress();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const router = useRouter();

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsFormOpen(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (address: Address) => {
        if (address.la_mac_dinh) {
            toast.error('Không thể xóa địa chỉ mặc định!');
            return;
        }
        setDeletingId(address.id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteAddress(deletingId);
            toast.success('Đã xóa địa chỉ thành công');
        } catch (err: any) {
            toast.error(err?.message || 'Xóa địa chỉ thất bại');
        } finally {
            setIsDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    const handleSetDefault = async (address: Address) => {
        if (address.la_mac_dinh) return;
        try {
            await updateAddress({ id: address.id, payload: { la_mac_dinh: true } });
            toast.success('Đã đặt làm địa chỉ mặc định');
        } catch (err: any) {
            toast.error(err?.message || 'Lỗi khi đặt mặc định');
        }
    };

    const sortedAddresses = addresses ? [...addresses].sort((a, b) => {
        if (a.la_mac_dinh) return -1;
        if (b.la_mac_dinh) return 1;
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    }) : [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5">
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </Button>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 pl-0 gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Sổ địa chỉ</h1>
                        <p className="text-sm text-slate-500">Quản lý địa chỉ giao hàng của bạn</p>
                    </div>
                </div>
                <Button onClick={handleAddNew} className="shadow-sm gap-1.5 rounded-xl">
                    <Plus className="h-4 w-4" />
                    Thêm địa chỉ
                </Button>
            </div>

            {error ? (
                <div className="text-center py-12 bg-white rounded-xl border border-rose-100">
                    <p className="text-rose-500">Đã có lỗi xảy ra khi tải danh sách địa chỉ.</p>
                </div>
            ) : sortedAddresses.length === 0 ? (
                <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có địa chỉ nào</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Thêm địa chỉ giao hàng để đặt hàng nhanh chóng hơn.
                        </p>
                        <Button onClick={handleAddNew} variant="outline" className="bg-white gap-1.5">
                            <Plus className="h-4 w-4" />
                            Thêm địa chỉ ngay
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {sortedAddresses.map((address) => (
                        <Card
                            key={address.id}
                            className={`relative overflow-hidden transition-all hover:shadow-md border-slate-200/60 ${
                                address.la_mac_dinh ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-100' : ''
                            }`}
                        >
                            {/* Default badge */}
                            {address.la_mac_dinh && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm z-10">
                                    <ShieldCheck className="w-3 h-3" />
                                    Mặc định
                                </div>
                            )}

                            <CardContent className="p-5">
                                {/* Name */}
                                <div className="flex items-start gap-3 mb-3 pr-14">
                                    <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{address.ho_va_ten}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-500">
                                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                                            {address.so_dien_thoai}
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
                                    {address.dia_chi_cu_the}, {address.phuong_xa}, {address.quan_huyen}, {address.tinh_thanh}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 items-center">
                                    {!address.la_mac_dinh && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetDefault(address)}
                                            className="h-8 text-xs rounded-lg border-slate-200 flex-1 gap-1"
                                        >
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Đặt mặc định
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(address)}
                                        className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(address)}
                                        disabled={address.la_mac_dinh}
                                        className={`h-8 w-8 rounded-lg ${address.la_mac_dinh ? 'text-slate-200 cursor-not-allowed' : 'text-rose-500 hover:text-rose-600 hover:bg-rose-50'}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AddressFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                initialData={editingAddress}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa địa chỉ này?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e: React.MouseEvent) => { e.preventDefault(); confirmDelete(); }}
                            className="bg-rose-500 hover:bg-rose-600 text-white"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Đồng ý xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
