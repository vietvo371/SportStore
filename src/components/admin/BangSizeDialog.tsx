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
import { Textarea } from "@/components/ui/textarea";
import { useCreateSizeChart, useUpdateSizeChart } from "@/hooks/useAdminSizeCharts";
import { useAdminBrands } from "@/hooks/useAdminCatalog";
import { Loader2, Ruler, Info } from "lucide-react";

const sizeChartSchema = z.object({
    thuong_hieu_id: z.string().nullable().optional(),
    loai: z.enum(["ao", "quan", "giay"]),
    ten_size: z.string().min(1, "Tên size không được để trống"),
    chieu_cao_min: z.coerce.number().optional(),
    chieu_cao_max: z.coerce.number().optional(),
    can_nang_min: z.coerce.number().optional(),
    can_nang_max: z.coerce.number().optional(),
    chieu_dai_chan_min: z.coerce.number().optional(),
    chieu_dai_chan_max: z.coerce.number().optional(),
    mo_ta: z.string().optional(),
});

interface BangSizeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sizeChart?: any;
}

export function BangSizeDialog({ open, onOpenChange, sizeChart }: BangSizeDialogProps) {
    const isEdit = !!sizeChart;
    const createSizeChart = useCreateSizeChart();
    const updateSizeChart = useUpdateSizeChart();
    const { data: brandsResponse } = useAdminBrands();
    const brands = brandsResponse?.data || [];

    const form = useForm<any>({
        resolver: zodResolver(sizeChartSchema),
        defaultValues: {
            thuong_hieu_id: "all",
            loai: "ao",
            ten_size: "",
            chieu_cao_min: 0,
            chieu_cao_max: 0,
            can_nang_min: 0,
            can_nang_max: 0,
            chieu_dai_chan_min: 0,
            chieu_dai_chan_max: 0,
            mo_ta: "",
        },
    });

    useEffect(() => {
        if (sizeChart && open) {
            form.reset({
                thuong_hieu_id: sizeChart.thuong_hieu_id?.toString() || "all",
                loai: sizeChart.loai,
                ten_size: sizeChart.ten_size,
                chieu_cao_min: sizeChart.chieu_cao_min || 0,
                chieu_cao_max: sizeChart.chieu_cao_max || 0,
                can_nang_min: sizeChart.can_nang_min || 0,
                can_nang_max: sizeChart.can_nang_max || 0,
                chieu_dai_chan_min: sizeChart.chieu_dai_chan_min || 0,
                chieu_dai_chan_max: sizeChart.chieu_dai_chan_max || 0,
                mo_ta: sizeChart.mo_ta || "",
            });
        } else if (!isEdit && open) {
            form.reset({
                thuong_hieu_id: "all",
                loai: "ao",
                ten_size: "",
                chieu_cao_min: 0,
                chieu_cao_max: 0,
                can_nang_min: 0,
                can_nang_max: 0,
                chieu_dai_chan_min: 0,
                chieu_dai_chan_max: 0,
                mo_ta: "",
            });
        }
    }, [sizeChart, open, form, isEdit]);

    const onSubmit = async (values: any) => {
        const data = { ...values };
        if (data.thuong_hieu_id === "all") data.thuong_hieu_id = null;
        
        if (isEdit) {
            await updateSizeChart.mutateAsync({ id: sizeChart.id, data });
        } else {
            await createSizeChart.mutateAsync(data);
        }
        onOpenChange(false);
    };

    const isPending = createSizeChart.isPending || updateSizeChart.isPending;
    const selectedType = form.watch("loai");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-3xl shadow-2xl bg-white overflow-hidden p-0 border-none">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-primary/10 rounded-xl">
                                <Ruler className="h-6 w-6 text-primary" />
                             </div>
                             <DialogTitle className="text-2xl font-bold tracking-tight">
                                {isEdit ? "Chỉnh sửa quy tắc" : "Thêm quy tắc size"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 text-sm">
                            {isEdit ? "Cập nhật các chỉ số phù hợp cho size sản phẩm" : "Thiết lập khoảng chiều cao, cân nặng hoặc độ dài chân cho kích cỡ"}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="thuong_hieu_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-slate-700">Thương hiệu</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-primary/20">
                                                        <SelectValue placeholder="Chọn thương hiệu" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                    <SelectItem value="all">Dùng chung (Tất cả)</SelectItem>
                                                    {brands?.map((brand: any) => (
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

                                <FormField
                                    control={form.control}
                                    name="loai"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-slate-700">Loại sản phẩm</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-primary/20">
                                                        <SelectValue placeholder="Chọn loại" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                    <SelectItem value="ao">Áo</SelectItem>
                                                    <SelectItem value="quan">Quần</SelectItem>
                                                    <SelectItem value="giay">Giày</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ten_size"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-sm font-bold text-slate-700">Tên Size (Vd: XL, 42, XXL...)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Vd: XL"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-bold text-lg"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {(selectedType === "ao" || selectedType === "quan") && (
                                    <>
                                        <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <Info className="h-5 w-5 text-blue-500" />
                                            <p className="text-xs text-slate-600 font-medium italic">
                                                Để trống hoặc nhập 0 nếu không muốn giới hạn khoảng chỉ số.
                                            </p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="chieu_cao_min"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chiều cao tối thiểu (cm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} className="rounded-xl border-slate-200 h-11" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="chieu_cao_max"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chiều cao tối đa (cm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} className="rounded-xl border-slate-200 h-11" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="can_nang_min"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cân nặng tối thiểu (kg)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} className="rounded-xl border-slate-200 h-11" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="can_nang_max"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cân nặng tối đa (kg)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} className="rounded-xl border-slate-200 h-11" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {selectedType === "giay" && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="chieu_dai_chan_min"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dài chân tối thiểu (mm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Vd: 255" {...field} className="rounded-xl border-slate-200 h-11" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="chieu_dai_chan_max"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dài chân tối đa (mm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Vd: 265" {...field} className="rounded-xl border-slate-200 h-11" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                <FormField
                                    control={form.control}
                                    name="mo_ta"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-sm font-bold text-slate-700">Mô tả thêm</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Vd: Phù hợp cho form người Việt Nam"
                                                    {...field}
                                                    className="rounded-xl border-slate-200 min-h-[80px]"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="gap-3 mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl h-11 px-6 font-medium"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Đóng
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-xl h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {isEdit ? "Cập nhật" : "Thêm quy tắc"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
