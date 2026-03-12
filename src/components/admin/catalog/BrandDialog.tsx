"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const formSchema = z.object({
    ten: z.string().min(2, "Tên thương hiệu phải có ít nhất 2 ký tự"),
    mo_ta: z.string().optional(),
    trang_thai: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

import {
    Dialog,
    DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield } from "lucide-react";
import { useEffect } from "react";
import { useCreateBrand, useUpdateBrand } from "@/hooks/useAdminCatalog";

interface BrandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: any | null;
}

export function BrandDialog({
    open,
    onOpenChange,
    brand,
}: BrandDialogProps) {
    const isEdit = !!brand;
    const createMutation = useCreateBrand();
    const updateMutation = useUpdateBrand();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ten: "",
            mo_ta: "",
            trang_thai: true,
        },
    });

    useEffect(() => {
        if (brand) {
            form.reset({
                ten: brand.ten || "",
                mo_ta: brand.mo_ta || "",
                trang_thai: !!brand.trang_thai,
            });
        } else {
            form.reset({
                ten: "",
                mo_ta: "",
                trang_thai: true,
            });
        }
    }, [brand, form, open]);

    function onSubmit(values: FormValues) {
        if (isEdit) {
            updateMutation.mutate(
                { id: brand.id, data: values },
                {
                    onSuccess: () => onOpenChange(false),
                }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: () => onOpenChange(false),
            });
        }
    }

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-2xl shadow-lg bg-white overflow-hidden p-0 border border-slate-100">
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {isEdit ? "Chi tiết thương hiệu" : "Thương hiệu mới"}
                        </DialogTitle>
                        <p className="text-sm text-slate-500 mt-1">Định danh nhãn hàng cung cấp</p>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
                        <FormField
                            control={form.control}
                            name="ten"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Tên thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Nike, Adidas, Puma..." {...field} className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mo_ta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Mô tả chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập thông tin giới thiệu về thương hiệu này..."
                                            {...field}
                                            className="rounded-xl border-slate-200 bg-white min-h-[120px] focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trang_thai"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 p-4 bg-white">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-semibold text-slate-900">Cho phép hoạt động</FormLabel>
                                        <p className="text-xs text-slate-500">Bật để hiển thị thương hiệu này trên bộ lọc sản phẩm</p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="px-8 pb-6 pt-4 gap-2 border-t border-slate-100 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="rounded-xl"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {isEdit ? "Cập nhật" : "Tạo nhãn hàng"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
