'use client';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAdminUsers";
import { useAdminRoles } from "@/hooks/useAdminRoles";
import { Loader2, ShieldCheck, UserCog, Ban, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Crown } from "lucide-react";

const userSchema = z.object({
    vai_tro: z.string(),
    trang_thai: z.boolean(),
    vai_tro_ids: z.array(z.number()),
});

interface UserEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
}

export function UserEditDialog({ open, onOpenChange, user }: UserEditDialogProps) {
    const { roles, isLoadingRoles } = useAdminRoles();
    const updateUser = useUpdateUser();

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            vai_tro: "khach_hang",
            trang_thai: true,
            vai_tro_ids: [],
        },
    });

    useEffect(() => {
        if (user && open) {
            form.reset({
                vai_tro: user.vai_tro,
                trang_thai: user.trang_thai,
                vai_tro_ids: user.cac_vai_tro?.map((r: any) => r.id) || [],
            });
        }
    }, [user, open, form]);

    const onSubmit = async (values: z.infer<typeof userSchema>) => {
        await updateUser.mutateAsync({ id: user.id, data: values });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thiết lập tài khoản</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa quyền hạn và trạng thái hoạt động của người dùng
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                                        {user?.anh_dai_dien ? (
                                            <img src={user.anh_dai_dien} alt={user.ho_va_ten} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="font-black text-slate-400 text-xs">{user?.ho_va_ten?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 text-sm leading-none">{user?.ho_va_ten}</span>
                                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{user?.email}</span>
                                    </div>
                                </div>

                                {user?.is_master && (
                                    <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl">
                                        <Crown className="h-4 w-4 shrink-0" />
                                        <p className="text-[10px] font-bold uppercase tracking-wider">
                                            Đây là tài khoản Master của hệ thống. Bạn không thể thay đổi thông tin này.
                                        </p>
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="vai_tro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vai trò hệ thống</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn vai trò" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="khach_hang">Không cấp quyền admin</SelectItem>
                                                    <SelectItem value="quan_tri">Cấp quyền admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4 pt-4 border-t">
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        Gán vai trò chi tiết
                                    </Label>
                                    {isLoadingRoles ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {roles.map((role) => (
                                                <FormField
                                                    key={role.id}
                                                    control={form.control}
                                                    name="vai_tro_ids"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-slate-50 transition-colors">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(role.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, role.id])
                                                                            : field.onChange(field.value?.filter((value: number) => value !== role.id));
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel className="text-xs font-bold cursor-pointer">
                                                                    {role.ten}
                                                                </FormLabel>
                                                                <p className="text-[10px] text-muted-foreground">{role.ma_slug}</p>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="trang_thai"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-slate-50/50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Trạng thái hoạt động
                                                </FormLabel>
                                                <div className="text-sm text-slate-500">
                                                    {field.value ? "Tài khoản đang mở" : "Tài khoản đang bị khóa"}
                                                </div>
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
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={updateUser.isPending || user?.is_master}>
                                    {updateUser.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Lưu thay đổi
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
