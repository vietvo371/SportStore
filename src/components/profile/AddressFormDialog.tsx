import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAddress } from '@/hooks/useAddress';
import { Address, AddressPayload } from '@/types/address.types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { VietnamAddressFields } from '@/components/address/VietnamAddressFields';

interface AddressFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Address | null;
}

export function AddressFormDialog({ open, onOpenChange, initialData }: AddressFormDialogProps) {
    const { createAddress, updateAddress, isCreating, isUpdating } = useAddress();
    const isEditMode = !!initialData;
    const isSubmitting = isCreating || isUpdating;

    const form = useForm<AddressPayload>({
        defaultValues: {
            ho_va_ten: '',
            so_dien_thoai: '',
            tinh_thanh: '',
            quan_huyen: '',
            phuong_xa: '',
            dia_chi_cu_the: '',
            la_mac_dinh: false,
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    ho_va_ten: initialData.ho_va_ten,
                    so_dien_thoai: initialData.so_dien_thoai,
                    tinh_thanh: initialData.tinh_thanh,
                    quan_huyen: initialData.quan_huyen,
                    phuong_xa: initialData.phuong_xa,
                    dia_chi_cu_the: initialData.dia_chi_cu_the,
                    la_mac_dinh: initialData.la_mac_dinh,
                });
            } else {
                form.reset({
                    ho_va_ten: '',
                    so_dien_thoai: '',
                    tinh_thanh: '',
                    quan_huyen: '',
                    phuong_xa: '',
                    dia_chi_cu_the: '',
                    la_mac_dinh: false,
                });
            }
        }
    }, [open, initialData, form]);

    const onSubmit = async (data: AddressPayload) => {
        try {
            if (isEditMode && initialData) {
                await updateAddress({ id: initialData.id, payload: data });
                toast.success('Đã cập nhật địa chỉ thành công!');
            } else {
                await createAddress(data);
                toast.success('Đã thêm địa chỉ giao hàng mới!');
            }
            onOpenChange(false);
        } catch (error: any) {
            const errMsgs = error?.errors ? Object.values(error.errors).flat().join(', ') : error?.message;
            toast.error(errMsgs || 'Có lỗi xảy ra khi lưu địa chỉ.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Cập Nhật Địa Chỉ' : 'Thêm Địa Chỉ Giao Hàng'}</DialogTitle>
                    <DialogDescription>
                        Điền đầy đủ thông tin để quá trình giao hàng được diễn ra thuận lợi nhất.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ho_va_ten"
                                rules={{ required: 'Vui lòng nhập họ và tên' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và Tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nguyễn Văn A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="so_dien_thoai"
                                rules={{
                                    required: 'Vui lòng nhập số điện thoại',
                                    pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g, message: 'Số điện thoại không hợp lệ' }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0987654321" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <VietnamAddressFields
                            resetKey={`${open}-${initialData?.id ?? 'new'}`}
                            initialProvince={initialData?.tinh_thanh}
                            initialDistrict={initialData?.quan_huyen}
                            initialWard={initialData?.phuong_xa}
                            initialAddress={initialData?.dia_chi_cu_the}
                        />

                        <FormField
                            control={form.control}
                            name="la_mac_dinh"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isEditMode && initialData?.la_mac_dinh} // Prevent unchecking if already default, usually handled by checking another one
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                                        {isEditMode && initialData?.la_mac_dinh && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                (Đây đang là địa chỉ mặc định của bạn. Hãy chọn địa chỉ khác làm mặc định nếu muốn thay đổi)
                                            </p>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Địa Chỉ'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
