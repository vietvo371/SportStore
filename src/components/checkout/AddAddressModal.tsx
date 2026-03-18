import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddress } from '@/hooks/useAddress';
import { AddressPayload } from '@/types/address.types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Loader2, Plus } from 'lucide-react';
import { VietnamAddressFields } from '@/components/address/VietnamAddressFields';

export function AddAddressModal() {
    const [open, setOpen] = useState(false);
    const { createAddress, isCreating } = useAddress();

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

    const onSubmit = async (data: AddressPayload) => {
        try {
            await createAddress(data);
            toast.success('Đã thêm địa chỉ giao hàng mới!');
            setOpen(false);
            form.reset();
        } catch (error: any) {
            const errMsgs = error?.errors ? Object.values(error.errors).flat().join(', ') : error?.message;
            toast.error(errMsgs || 'Có lỗi xảy ra khi thêm địa chỉ.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 border-dashed border-2 bg-slate-50 hover:bg-slate-100 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm địa chỉ giao hàng mới
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm Địa Chỉ Giao Hàng</DialogTitle>
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

                        <VietnamAddressFields resetKey={open} />

                        <FormField
                            control={form.control}
                            name="la_mac_dinh"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Lưu Địa Chỉ
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
