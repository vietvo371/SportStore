'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Category } from "@/types/product.types";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminMetadata } from "@/hooks/useAdmin";
import { Plus, Loader2, Save, X, Trash2, Image as ImageIcon, CheckCircle2, FolderOpen, CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const productSchema = z.object({
    ten_san_pham: z.string().min(5, "Tên sản phẩm ít nhất 5 ký tự").max(200, "Tên sản phẩm tối đa 200 ký tự"),
    danh_muc_id: z.string().min(1, "Vui lòng chọn danh mục"),
    thuong_hieu_id: z.string().optional().nullable(),
    gia_goc: z.number().positive("Giá gốc phải lớn hơn 0"),
    gia_khuyen_mai: z.number().min(0).optional().nullable(),
    mo_ta_ngan: z.string().min(10, "Mô tả ngắn ít nhất 10 ký tự").max(500, "Mô tả ngắn tối đa 500 ký tự"),
    mo_ta_day_du: z.string().min(20, "Mô tả chi tiết ít nhất 20 ký tự"),
    trang_thai: z.boolean(),
    ma_sku: z.string().min(1, "Mã SKU là bắt buộc").max(100, "SKU tối đa 100 ký tự"),
    noi_bat: z.boolean(),
    bien_the: z.array(z.object({
        id: z.number().optional(),
        kich_co: z.string().min(1, "Thiếu size"),
        mau_sac: z.string().optional().nullable(),
        gia_rieng: z.number().min(0).optional().nullable(),
        ton_kho: z.number().min(0, "Tồn kho không được âm"),
    })).min(1, "Sản phẩm phải có ít nhất 1 phân loại (Size/Màu)"),
    hinh_anh: z.array(z.object({
        duong_dan_anh: z.string(),
        la_anh_chinh: z.boolean(),
        thu_tu: z.number(),
    })).min(1, "Vui lòng thêm ít nhất 1 hình ảnh sản phẩm"),
}).refine(data => {
    if (data.gia_khuyen_mai !== null && data.gia_khuyen_mai !== undefined) {
        return data.gia_khuyen_mai < data.gia_goc;
    }
    return true;
}, {
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    path: ["gia_khuyen_mai"]
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const { categories, brands, isLoading: isLoadingMetadata } = useAdminMetadata();
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            ten_san_pham: initialData.ten_san_pham,
            danh_muc_id: initialData.danh_muc_id.toString(),
            thuong_hieu_id: initialData.thuong_hieu_id?.toString() || undefined,
            gia_goc: initialData.gia_goc ? parseFloat(initialData.gia_goc as any) : 0,
            gia_khuyen_mai: initialData.gia_khuyen_mai ? parseFloat(initialData.gia_khuyen_mai as any) : null,
            mo_ta_ngan: initialData.mo_ta_ngan || "",
            mo_ta_day_du: initialData.mo_ta_day_du || "",
            trang_thai: !!initialData.trang_thai,
            ma_sku: initialData.ma_sku || "",
            noi_bat: !!initialData.noi_bat,
            bien_the: initialData.bien_the?.map(bt => ({
                id: bt.id,
                kich_co: bt.kich_co || "",
                mau_sac: bt.mau_sac || "",
                gia_rieng: bt.gia_rieng ? parseFloat(bt.gia_rieng as any) : null,
                ton_kho: bt.ton_kho,
            })) || [],
            hinh_anh: initialData.hinh_anh?.map(img => ({
                duong_dan_anh: img.duong_dan_anh,
                la_anh_chinh: !!img.la_anh_chinh,
                thu_tu: img.thu_tu || 0,
            })) || [],
        } : {
            ten_san_pham: "",
            danh_muc_id: "",
            thuong_hieu_id: undefined,
            gia_goc: 0,
            gia_khuyen_mai: null,
            mo_ta_ngan: "",
            mo_ta_day_du: "",
            trang_thai: true,
            ma_sku: "",
            noi_bat: false,
            bien_the: [],
            hinh_anh: [],
        },
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control: form.control,
        name: "bien_the",
    });

    const { fields: imageFields, append: appendImage, remove: removeImage, update: updateImage } = useFieldArray({
        control: form.control,
        name: "hinh_anh",
    });

    const mutation = useMutation({
        mutationFn: (values: ProductFormValues) => {
            const data = {
                ...values,
                danh_muc_id: parseInt(values.danh_muc_id),
                thuong_hieu_id: values.thuong_hieu_id ? parseInt(values.thuong_hieu_id) : null,
            };
            return isEdit && initialData
                ? adminService.updateProduct(initialData.id, data)
                : adminService.createProduct(data);
        },
        onSuccess: () => {
            toast.success(isEdit ? "Cập nhật sản phẩm thành công" : "Tạo sản phẩm thành công");
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            router.push("/admin/products");
            router.refresh();
        },
        onError: (error: any) => {
            if (error.status === 422 && error.errors) {
                const errors = error.errors;
                Object.keys(errors).forEach((key) => {
                    form.setError(key as any, {
                        type: "server",
                        message: errors[key][0],
                    });
                });

                // Show the first error in the toast for better visibility
                const firstErrorKey = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstErrorKey][0];
                toast.error(firstErrorMessage || "Dữ liệu không hợp lệ");
            } else {
                toast.error(error.message || "Có lỗi xảy ra");
            }
        }
    });

    const onSubmit = (values: ProductFormValues) => {
        mutation.mutate(values);
    };

    if (isLoadingMetadata) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ten san pham */}
                    <FormField
                        control={form.control}
                        name="ten_san_pham"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Tên sản phẩm <span className="text-rose-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên sản phẩm..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Danh muc */}
                    <FormField
                        control={form.control}
                        name="danh_muc_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Danh mục <span className="text-rose-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục con..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-80">
                                        {(categories as Category[]).map((parent, idx) => {
                                            const children = parent.danh_muc_con ?? [];
                                            const isLast = idx === (categories as Category[]).length - 1;
                                            if (children.length > 0) {
                                                return (
                                                    <SelectGroup key={parent.id}>
                                                        {/* Header danh mục cha */}
                                                        <SelectLabel className="flex items-center gap-1.5 px-2 py-2 text-xs font-bold text-primary bg-primary/5 border-b border-primary/10 -mx-1 mb-1">
                                                            <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                                                            {parent.ten}
                                                        </SelectLabel>
                                                        {/* Danh mục con */}
                                                        {children.map((child) => (
                                                            <SelectItem
                                                                key={child.id}
                                                                value={child.id.toString()}
                                                                className="pl-7 text-sm text-slate-700 focus:bg-primary/10 focus:text-primary"
                                                            >
                                                                <span className="flex items-center gap-1.5">
                                                                    <CornerDownRight className="h-3 w-3 text-slate-400 shrink-0" />
                                                                    {child.ten}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                        {!isLast && <SelectSeparator className="mt-1" />}
                                                    </SelectGroup>
                                                );
                                            }
                                            // Danh mục độc lập (không có con)
                                            return (
                                                <SelectItem key={parent.id} value={parent.id.toString()} className="font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <FolderOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                        {parent.ten}
                                                    </span>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Thuong hieu */}
                    <FormField
                        control={form.control}
                        name="thuong_hieu_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thương hiệu</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thương hiệu" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brands.map((brand: any) => (
                                            <SelectItem key={brand.id} value={brand.id.toString()}>
                                                {brand.ten}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ma SKU */}
                    <FormField
                        control={form.control}
                        name="ma_sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã SKU <span className="text-rose-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: BALO-HELIX-01" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gia goc */}
                    <FormField
                        control={form.control}
                        name="gia_goc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá gốc (₫) <span className="text-rose-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="VD: 350000"
                                        min={0}
                                        {...field}
                                        value={field.value === 0 ? "" : field.value}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val === "" ? 0 : parseFloat(val));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gia khuyen mai */}
                    <FormField
                        control={form.control}
                        name="gia_khuyen_mai"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá khuyến mãi (₫)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="Để trống nếu không giảm giá"
                                        min={0}
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val === "" ? null : parseFloat(val));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hinh anh Section */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-primary" />
                                Hình ảnh sản phẩm <span className="text-rose-500 text-sm">* (Ít nhất 1 ảnh)</span>
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const input = document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    input.multiple = true;
                                    input.onchange = async (e) => {
                                        const files = (e.target as HTMLInputElement).files;
                                        if (files) {
                                            const MAX_SIZE = 2 * 1024 * 1024; // 2MB — match BE validation
                                            for (let i = 0; i < files.length; i++) {
                                                const file = files[i];

                                                if (file.size > MAX_SIZE) {
                                                    toast.error(`Ảnh "${file.name}" vượt quá 2MB, vui lòng chọn ảnh nhỏ hơn.`);
                                                    continue;
                                                }

                                                try {
                                                    const res = await adminService.uploadImage(file);
                                                    appendImage({
                                                        duong_dan_anh: res.data.url,
                                                        la_anh_chinh: imageFields.length === 0 && i === 0,
                                                        thu_tu: imageFields.length + i,
                                                    });
                                                } catch (err: any) {
                                                    const status = err?.response?.status ?? err?.status;
                                                    if (status === 413) {
                                                        toast.error(`Ảnh "${file.name}" quá lớn. Server chỉ nhận file tối đa 2MB.`);
                                                    } else {
                                                        const msg = err?.response?.data?.message ?? err?.message ?? 'Có lỗi xảy ra';
                                                        toast.error(`Lỗi upload "${file.name}": ${msg}`);
                                                    }
                                                }
                                            }
                                        }
                                    };
                                    input.click();
                                }}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {imageFields.map((field, index) => (
                                <div key={field.id} className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                    <Image
                                        src={field.duong_dan_anh}
                                        alt="Product"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant={field.la_anh_chinh ? "default" : "secondary"}
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                                imageFields.forEach((_, i) => {
                                                    updateImage(i, { ...imageFields[i], la_anh_chinh: i === index });
                                                });
                                            }}
                                            title={field.la_anh_chinh ? "Ảnh chính" : "Đặt làm ảnh chính"}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => removeImage(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {field.la_anh_chinh && (
                                        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded shadow-sm">
                                            CHÍNH
                                        </div>
                                    )}
                                </div>
                            ))}
                            {imageFields.length === 0 && (
                                <div className="col-span-full py-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                                    Chưa có hình ảnh nào. Nhấn "Thêm ảnh" để upload.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bien the Section */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <Plus className="h-5 w-5 text-primary" />
                                Biến thể sản phẩm (Size / Màu sắc) <span className="text-rose-500 text-sm">* (Ít nhất 1 phân loại)</span>
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendVariant({ kich_co: "", mau_sac: "", ton_kho: 0, gia_rieng: null })}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Thêm biến thể
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {variantFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-lg border border-slate-200 bg-white shadow-sm">
                                    <div className="col-span-3">
                                        <FormLabel className="text-xs">Kích cỡ (Size)</FormLabel>
                                        <Input
                                            placeholder="VD: L, XL, 42..."
                                            {...form.register(`bien_the.${index}.kich_co`)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormLabel className="text-xs">Màu sắc</FormLabel>
                                        <Input
                                            placeholder="VD: Đen, Trắng..."
                                            {...form.register(`bien_the.${index}.mau_sac`)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <FormLabel className="text-xs">Tồn kho</FormLabel>
                                        <Input
                                            type="number"
                                            inputMode="numeric"
                                            placeholder="0"
                                            min={0}
                                            {...form.register(`bien_the.${index}.ton_kho`, {
                                                setValueAs: (v: any) => v === "" ? 0 : parseInt(v, 10),
                                            })}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormLabel className="text-xs">Giá riêng (₫)</FormLabel>
                                        <Input
                                            type="number"
                                            inputMode="numeric"
                                            placeholder="Để trống nếu = giá gốc"
                                            min={0}
                                            {...form.register(`bien_the.${index}.gia_rieng`, {
                                                setValueAs: (v: any) => v === "" ? null : parseFloat(v),
                                            })}
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeVariant(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {variantFields.length === 0 && (
                                <div className="py-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                                    Sản phẩm chưa có biến thể nào.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mo ta ngan */}
                    <FormField
                        control={form.control}
                        name="mo_ta_ngan"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Mô tả ngắn <span className="text-rose-500">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tóm tắt đặc điểm nổi bật..."
                                        className="h-20"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mo ta day du */}
                    <FormField
                        control={form.control}
                        name="mo_ta_day_du"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Mô tả chi tiết <span className="text-rose-500">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Thông tin chi tiết kỹ thuật, chất liệu..."
                                        className="min-h-[200px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Switches */}
                    <div className="flex gap-8 md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <FormField
                            control={form.control}
                            name="trang_thai"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Mở bán ngay</FormLabel>
                                        <p className="text-xs text-slate-500 italic">Hiện sản phẩm trên cửa hàng</p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="noi_bat"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Sản phẩm nổi bật</FormLabel>
                                        <p className="text-xs text-slate-500 italic">Đưa lên trang chủ</p>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="min-w-[140px]"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEdit ? "Cập nhật" : "Tạo sản phẩm"}
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={mutation.isPending}
                    >
                        <X className="mr-2 h-4 w-4" /> Hủy
                    </Button>
                </div>
            </form>
        </Form>
    );
}
