"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Layers } from "lucide-react";
import { useEffect } from "react";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useAdminCatalog";

const formSchema = z.object({
    ten: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
    danh_muc_cha_id: z.string().nullable(),
    trang_thai: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: any | null;
    categories: any[];
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
    categories,
}: CategoryDialogProps) {
    const isEdit = !!category;
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ten: "",
            danh_muc_cha_id: null,
            trang_thai: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (category) {
                form.reset({
                    ten: category.ten,
                    // Dùng "none" thay null để Select hiện đúng "Không có danh mục cha"
                    danh_muc_cha_id: category.danh_muc_cha_id?.toString() ?? "none",
                    trang_thai: !!category.trang_thai,
                });
            } else {
                form.reset({
                    ten: "",
                    danh_muc_cha_id: "none",
                    trang_thai: true,
                });
            }
        }
    }, [category, open]); // bỏ form khỏi deps tránh infinite loop

    function onSubmit(values: FormValues) {
        const data = {
            ...values,
            // "none" → null (danh mục gốc), còn lại parse thành số
            danh_muc_cha_id: values.danh_muc_cha_id && values.danh_muc_cha_id !== "none"
                ? parseInt(values.danh_muc_cha_id)
                : null,
        };

        if (isEdit) {
            updateMutation.mutate(
                { id: category.id, data },
                {
                    onSuccess: () => onOpenChange(false),
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => onOpenChange(false),
            });
        }
    }

    const isLoading = createMutation.isPending || updateMutation.isPending;

    // Flatten categories for select, excluding current category and its children to prevent circular refs
    const flattenCategories = (items: any[], depth = 0): any[] => {
        let result: any[] = [];
        items.forEach((item) => {
            if (isEdit && item.id === category.id) return;
            result.push({ id: item.id, ten: item.ten, depth });
            if (item.danh_muc_con && item.danh_muc_con.length > 0) {
                result = [...result, ...flattenCategories(item.danh_muc_con, depth + 1)];
            }
        });
        return result;
    };

    const flatCategories = flattenCategories(categories);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-2xl shadow-lg bg-white overflow-hidden p-0 border border-slate-100">
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {isEdit ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
                        </DialogTitle>
                        <p className="text-sm text-slate-500 mt-1">Phân loại sản phẩm hệ thống</p>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
                        <FormField
                            control={form.control}
                            name="ten"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Tên danh mục</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Giày chạy bộ chuyên dụng" {...field} className="rounded-xl border-slate-200 bg-white h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="danh_muc_cha_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700">Danh mục cha (Tùy chọn)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? "none"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl border-slate-200 bg-white h-11 focus:ring-primary/20">
                                                <SelectValue placeholder="Chọn danh mục cha" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[300px]">
                                            <SelectItem value="none" className="text-slate-500 italic">— Không có (danh mục cấp 1)</SelectItem>
                                            {flatCategories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {"— ".repeat(cat.depth)} {cat.ten}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                        <FormLabel className="text-sm font-semibold text-slate-900">Trạng thái hiển thị</FormLabel>
                                        <p className="text-xs text-slate-500">Bật để khách hàng có thể thấy danh mục này</p>
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
                                {isEdit ? "Cập nhật" : "Tạo danh mục"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
