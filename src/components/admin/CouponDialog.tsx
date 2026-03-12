'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateCoupon, useUpdateCoupon } from "@/hooks/useAdminCoupons";
import { Loader2, Ticket, Calculator, Banknote, Calendar } from "lucide-react";

const couponSchema = z.object({
    ma_code: z.string().min(3, "Mã code phải có ít nhất 3 ký tự").max(50),
    loai_giam: z.enum(["phan_tram", "so_tien_co_dinh"]),
    gia_tri: z.coerce.number().min(0, "Giá trị không được âm"),
    gia_tri_don_hang_min: z.coerce.number().min(0).optional(),
    gioi_han_su_dung: z.coerce.number().min(1, "Giới hạn sử dụng phải ít nhất là 1").optional(),
    bat_dau_luc: z.string().optional(),
    het_han_luc: z.string().optional(),
}).refine((data) => {
    if (data.bat_dau_luc && data.het_han_luc) {
        return new Date(data.het_han_luc) > new Date(data.bat_dau_luc);
    }
    return true;
}, {
    message: "Ngày hết hạn phải sau ngày bắt đầu",
    path: ["het_han_luc"],
});

interface CouponDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coupon?: any;
}

export function CouponDialog({ open, onOpenChange, coupon }: CouponDialogProps) {
    const isEdit = !!coupon;
    const createCoupon = useCreateCoupon();
    const updateCoupon = useUpdateCoupon();

    const form = useForm<any>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            ma_code: "",
            loai_giam: "phan_tram",
            gia_tri: 0,
            gia_tri_don_hang_min: 0,
            gioi_han_su_dung: 100,
            bat_dau_luc: "",
            het_han_luc: "",
        },
    });

    useEffect(() => {
        if (coupon && open) {
            form.reset({
                ma_code: coupon.ma_code,
                loai_giam: coupon.loai_giam,
                gia_tri: coupon.gia_tri,
                gia_tri_don_hang_min: coupon.gia_tri_don_hang_min || 0,
                gioi_han_su_dung: coupon.gioi_han_su_dung || 100,
                bat_dau_luc: coupon.bat_dau_luc ? new Date(coupon.bat_dau_luc).toISOString().split('T')[0] : "",
                het_han_luc: coupon.het_han_luc ? new Date(coupon.het_han_luc).toISOString().split('T')[0] : "",
            });
        } else if (!isEdit && open) {
            form.reset({
                ma_code: "",
                loai_giam: "phan_tram",
                gia_tri: 0,
                gia_tri_don_hang_min: 0,
                gioi_han_su_dung: 100,
                bat_dau_luc: new Date().toISOString().split('T')[0],
                het_han_luc: "",
            });
        }
    }, [coupon, open, form, isEdit]);

    const onSubmit = async (values: z.infer<typeof couponSchema>) => {
        if (isEdit) {
            await updateCoupon.mutateAsync({ id: coupon.id, data: values });
        } else {
            await createCoupon.mutateAsync(values);
        }
        onOpenChange(false);
    };

    const isPending = createCoupon.isPending || updateCoupon.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-2xl shadow-lg bg-white overflow-hidden p-0 border border-slate-100">
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {isEdit ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá"}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 mt-1">
                            {isEdit ? "Cập nhật thông tin và điều kiện áp dụng cho mã" : "Thiết lập mã code và các chương trình ưu đãi mới"}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 pb-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="ma_code"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-sm font-semibold text-slate-700">Mã giảm giá (Code)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Vd: SUMMER2025"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all uppercase"
                                                    disabled={isEdit}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="loai_giam"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Loại giảm</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-slate-200 bg-white h-11 focus:ring-primary/20">
                                                        <SelectValue placeholder="Chọn loại giảm" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                    <SelectItem value="phan_tram">Phần trăm (%)</SelectItem>
                                                    <SelectItem value="so_tien_co_dinh">Số tiền (VNĐ)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gia_tri"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Mức giảm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gia_tri_don_hang_min"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Đơn tối thiểu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gioi_han_su_dung"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Tổng lượt dùng</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bat_dau_luc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Ngày bắt đầu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="het_han_luc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-slate-700">Ngày hết hạn</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="px-8 pb-6 pt-4 gap-2 border-t border-slate-100 sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200"
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {isEdit ? "Cập nhật" : "Tạo mã giảm giá"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
