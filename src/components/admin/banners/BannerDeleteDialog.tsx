import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBanner } from "@/hooks/useAdminBanners";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface BannerDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner: any;
    onClose: (deleted?: boolean) => void;
}

export function BannerDeleteDialog({
    open,
    onOpenChange,
    banner,
    onClose
}: BannerDeleteDialogProps) {
    const deleteMutation = useDeleteBanner();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!banner) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteMutation.mutateAsync(banner.id);
            onClose(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md p-6">
                <AlertDialogHeader className="mb-2">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                        <Trash2 className="h-6 w-6 text-rose-600" />
                    </div>
                    <AlertDialogTitle className="text-xl">Xóa Banner?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                        Bạn có chắc chắn muốn xóa banner <span className="font-semibold text-slate-800">"{banner.tieu_de}"</span>? Hành động này không thể hoàn tác và banner sẽ biến mất khỏi trang chủ.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        disabled={isDeleting}
                        className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-rose-600 focus:ring-rose-600 hover:bg-rose-700 text-white"
                    >
                        {isDeleting ? "Đang xóa..." : "Xóa Banner"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
