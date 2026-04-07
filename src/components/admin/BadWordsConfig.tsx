import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function BadWordsConfig() {
    const [open, setOpen] = useState(false);
    const [words, setWords] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchWords = async () => {
        try {
            setIsLoading(true);
            const res = await adminService.getBadWords();
            if (res.data) {
                setWords(res.data.join(", "));
            }
        } catch (error) {
            toast.error("Không thể tải danh sách từ cấm");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchWords();
        }
    }, [open]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const wordsArray = words
                .split(",")
                .map(w => w.trim())
                .filter(w => w.length > 0);
            
            await adminService.updateBadWords({ bad_words: wordsArray });
            toast.success("Đã cập nhật danh sách từ cấm");
            setOpen(false);
        } catch (error) {
            toast.error("Không thể cập nhật danh sách");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 font-bold hover:bg-slate-50 gap-2 shrink-0">
                    <Settings className="h-4 w-4" />
                    Cấu hình từ cấm
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Cấu hình từ cấm</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="bad-words">Danh sách từ cấm (cách nhau bởi dấu phẩy)</Label>
                            <Textarea
                                id="bad-words"
                                value={words}
                                onChange={(e) => setWords(e.target.value)}
                                placeholder="đĩ, điếm, ngu, ..."
                                className="min-h-[150px] resize-none"
                            />
                            <p className="text-xs text-slate-500">
                                Hệ thống sẽ tự động từ chối đánh giá chứa các từ vựng này. Không phân biệt hoa/thường.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving || isLoading}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Lưu thay đổi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
