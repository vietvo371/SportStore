'use client';

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2, Menu, Bell, Search, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Wait for hydration and check auth
        if (!isAuthenticated) {
            router.push("/login?callbackUrl=/admin");
            return;
        }

        if (user?.vai_tro !== "quan_tri") {
            router.push("/");
            return;
        }

        setIsAuthorized(true);
    }, [isAuthenticated, user, router]);

    if (!isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                    <p className="text-slate-500 font-medium tracking-tight">Đang xác thực quyền truy cập...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            {/* Desktop Sidebar */}
            <AdminSidebar className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 z-50 h-screen" />

            <div className="flex-1 flex flex-col lg:pl-64">
                {/* Responsive Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 flex items-center px-4 md:px-8 justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-slate-100 rounded-xl">
                                    <Menu className="h-5 w-5 text-slate-600" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-none shadow-2xl">
                                <SheetTitle className="sr-only">Menu Quản trị</SheetTitle>
                                <SheetDescription className="sr-only">Điều hướng các chức năng quản trị hệ thống</SheetDescription>
                                <AdminSidebar setOpen={setOpen} className="w-full h-full border-none" />
                            </SheetContent>
                        </Sheet>

                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
                            Hệ thống quản trị
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl">
                            <Search className="h-5 w-5" />
                        </Button>
                        <NotificationCenter />

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-primary transition-colors">
                                    {user?.ho_va_ten}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Administrator</span>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20 ring-2 ring-white">
                                {user?.ho_va_ten?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 animate-in fade-in duration-500">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
