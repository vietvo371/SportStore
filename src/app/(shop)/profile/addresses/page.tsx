'use client';

import { useState } from 'react';
import { useAddress } from '@/hooks/useAddress';
import { Address } from '@/types/address.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, MapPin, Trash2, Edit2, ShieldCheck } from 'lucide-react';
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

export default function AddressesPage() {
    const { addresses, isLoading, error, deleteAddress, isDeleting, updateAddress } = useAddress();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

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
        } catch (error: any) {
            toast.error(error.message || 'Xóa địa chỉ thất bại');
        } finally {
            setIsDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    const handleSetDefault = async (address: Address) => {
        if (address.la_mac_dinh) return;
        try {
            // BE API usually sets 'la_mac_dinh: true' and auto-removes the flag from the others
            await updateAddress({
                id: address.id,
                payload: { la_mac_dinh: true }
            });
            toast.success('Đã đặt làm địa chỉ mặc định');
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi đặt mặc định');
        }
    };

    // Sorting: Default address always on top
    const sortedAddresses = addresses ? [...addresses].sort((a, b) => {
        if (a.la_mac_dinh) return -1;
        if (b.la_mac_dinh) return 1;
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    }) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sổ địa chỉ</h1>
                    <p className="text-slate-500">Quản lý các địa chỉ giao hàng của bạn</p>
                </div>
                <Button onClick={handleAddNew} className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm địa chỉ mới
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-white rounded-xl border border-rose-100">
                    <p className="text-rose-500 mb-2">Đã có lỗi xảy ra khi tải danh sách địa chỉ.</p>
                </div>
            ) : sortedAddresses.length === 0 ? (
                <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                            <MapPin className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có địa chỉ nào</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Bạn chưa thêm địa chỉ giao hàng nào. Hãy thêm một địa chỉ để có thể mua hàng nhanh chóng hơn.
                        </p>
                        <Button onClick={handleAddNew} variant="outline" className="bg-white">
                            Thêm địa chỉ ngay
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedAddresses.map((address) => (
                        <Card
                            key={address.id}
                            className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${address.la_mac_dinh ? 'border-primary/50 shadow-sm ring-1 ring-primary/20 bg-primary/5' : 'border-slate-200/60'
                                }`}
                        >
                            {address.la_mac_dinh && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center shadow-sm">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Mặc định
                                </div>
                            )}

                            <CardHeader className="pb-3 border-b border-slate-100 bg-white/50">
                                <CardTitle className="text-base font-semibold flex items-center pr-16 text-slate-900">
                                    {address.ho_va_ten}
                                </CardTitle>
                                <CardDescription className="flex items-center text-slate-600 font-medium">
                                    {address.so_dien_thoai}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-4 pb-4 bg-white/50">
                                <div className="text-sm text-slate-600 min-h-[40px] flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <span>
                                        {address.dia_chi_cu_the}, {address.phuong_xa}, {address.quan_huyen}, {address.tinh_thanh}
                                    </span>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2 items-center lg:justify-end">
                                    {!address.la_mac_dinh && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8 mr-auto lg:mr-2 border-slate-200"
                                            onClick={() => handleSetDefault(address)}
                                        >
                                            Đặt mặc định
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                                        onClick={() => handleEdit(address)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-1.5" />
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 px-2 ${address.la_mac_dinh ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:text-rose-600 hover:bg-rose-50'}`}
                                        onClick={() => handleDeleteClick(address)}
                                        disabled={address.la_mac_dinh}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1.5" />
                                        Xóa
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
                            Bạn có chắc chắn muốn xóa địa chỉ này khỏi sổ địa chỉ không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
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
