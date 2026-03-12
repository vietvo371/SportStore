'use client';

import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface AccessDeniedProps {
    title?: string;
    description?: string;
    moduleName?: string;
}

export const AccessDenied = ({ 
    title = "Truy cập bị từ chối", 
    description = "Bạn không có đủ quyền hạn để truy cập vào module này. Vui lòng liên hệ với Quản trị viên để biết thêm chi tiết.",
    moduleName
}: AccessDeniedProps) => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 border-2 border-destructive/20">
                    <ShieldAlert className="w-12 h-12 text-destructive" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1.5 border shadow-sm">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-3">
                {title}
            </h1>
            
            {moduleName && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
                    Module: {moduleName}
                </div>
            )}

            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                </Button>
                <Button 
                    variant="default" 
                    onClick={() => router.push('/admin')}
                >
                    Về Dashboard
                </Button>
            </div>
            
            <Card className="mt-12 max-w-lg border-dashed bg-muted/30">
                <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground italic">
                        Nếu bạn tin rằng đây là một sự nhầm lẫn, hãy kiểm tra danh sách vai trò của mình trong phần hồ sơ hoặc yêu cầu cấp quyền [xem_user], [xem_sp] từ hệ thống.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
