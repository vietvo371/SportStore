'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { reviewService } from '@/services/review.service';

const formSchema = z.object({
    so_sao: z.number().min(1, 'Vui lòng chọn số sao').max(5),
    tieu_de: z.string().min(2, 'Tiêu đề quá ngắn').max(200),
    noi_dung: z.string().min(10, 'Nội dung đánh giá quá ngắn').max(1000),
});

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productId: number;
    orderId: number | null;
    onSuccess?: () => void;
}

export function ReviewModal({
    isOpen,
    onClose,
    productName,
    productId,
    orderId,
    onSuccess
}: ReviewModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            so_sao: 5,
            tieu_de: '',
            noi_dung: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await reviewService.submitReview({
                san_pham_id: productId,
                don_hang_id: orderId,
                ...values,
            });
            toast.success('Đánh giá của bạn đã được gửi và đang chờ duyệt.');
            form.reset();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Viết đánh giá sản phẩm</DialogTitle>
                    <DialogDescription>
                        Chia sẻ trải nghiệm của bạn về <strong>{productName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="so_sao"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center justify-center space-y-3">
                                    <FormLabel className="text-base font-semibold">Mức độ hài lòng</FormLabel>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-10 h-10 cursor-pointer transition-all ${(hoveredStar !== null ? star <= hoveredStar : star <= field.value)
                                                        ? 'fill-amber-400 text-amber-400 scale-110'
                                                        : 'text-slate-300'
                                                    }`}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(null)}
                                                onClick={() => field.onChange(star)}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tieu_de"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ví dụ: Sản phẩm rất tốt, giao hàng nhanh..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="noi_dung"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung đánh giá</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Hãy chia sẻ thêm về chất lượng sản phẩm, form dáng, màu sắc..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button type="submit" className="px-8 shadow-md" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
