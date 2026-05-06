'use client';

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AdminSidebar, getFirstAccessibleScreen } from "@/components/admin/AdminSidebar";
import { authService } from "@/services/auth.service";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { AdminRealtimeListener } from "@/components/admin/AdminRealtimeListener";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, _hasHydrated, updateUser, logout } = useAuthStore();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [open, setOpen] = useState(false);
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!isAuthenticated) {
            router.push("/login?callbackUrl=/admin");
            return;
        }

        const syncAndAuthorize = async () => {
            try {
                const res: any = await authService.getMe();

                let freshUser: any = null;
                if (res) {
                    if (typeof res === 'object') {
                        freshUser = (res as any).id ? res : (res as any).data;
                    }
                }

                if (!freshUser?.id) {
                    console.warn('[AdminLayout] Cannot fetch fresh permissions, using cached data');
                    const hasAdminRole = user?.cac_vai_tro?.some((r: any) => r.ma_slug !== 'customer')
                        || user?.is_master;
                    if (hasAdminRole) {
                        setIsAuthorized(true);
                    } else {
                        logout();
                        router.push("/");
                    }
                    return;
                }

                const fullUser = {
                    id: freshUser.id,
                    ho_va_ten: freshUser.ho_va_ten,
                    email: freshUser.email,
                    so_dien_thoai: freshUser.so_dien_thoai,
                    anh_dai_dien: freshUser.anh_dai_dien,
                    dia_chi: freshUser.dia_chi,
                    trang_thai: freshUser.trang_thai,
                    xac_thuc_email_luc: freshUser.xac_thuc_email_luc,
                    is_master: freshUser.is_master,
                    vai_tro: freshUser.vai_tro,
                    cac_vai_tro: freshUser.cac_vai_tro || [],
                };

                const hasAdminRole = fullUser.cac_vai_tro?.some((r: any) => r.ma_slug !== 'customer')
                    || fullUser.is_master;

                if (!hasAdminRole) {
                    logout();
                    router.push("/");
                    return;
                }

                updateUser(fullUser);
                setIsAuthorized(true);

                // Nếu không có quyền xem dashboard → redirect sang screen có quyền đầu tiên
                const userPermissions = new Set(
                    (fullUser.cac_vai_tro || []).flatMap((r: any) => r.quyen?.map((q: any) => q.ma_slug) || [])
                );
                const hasDashboard = fullUser.is_master || userPermissions.has('xem_dashboard');
                if (!hasDashboard && typeof window !== 'undefined') {
                    const firstScreen = getFirstAccessibleScreen(fullUser);
                    router.push(firstScreen);
                }
            } catch (error) {
                console.error('[AdminLayout] Failed to sync user permissions:', error);
                const hasAdminRole = user?.cac_vai_tro?.some((r: any) => r.ma_slug !== 'customer')
                    || user?.is_master;
                if (hasAdminRole) {
                    setIsAuthorized(true);
                } else {
                    logout();
                    router.push("/");
                }
            }
        };

        // Only call the API once per mount (not when user from store changes)
        if (!hasSynced.current) {
            hasSynced.current = true;
            syncAndAuthorize();
        } else {
            // Subsequent renders after first sync: just check auth with existing user
            const hasAdminRole = user?.cac_vai_tro?.some((r: any) => r.ma_slug !== 'customer')
                || user?.is_master;
            if (hasAdminRole) {
                setIsAuthorized(true);
            } else if (isAuthenticated) {
                logout();
                router.push("/");
            }
        }
    }, [_hasHydrated, isAuthenticated, router, logout]);

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
                        {/* <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl">
                            <Search className="h-5 w-5" />
                        </Button> */}
                        <NotificationCenter />

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-primary transition-colors">
                                    {user?.ho_va_ten}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    {user?.cac_vai_tro?.filter((r: any) => r.ma_slug !== 'customer')?.map((r: any) => r.ten).join(', ') || 'Administrator'}
                                </span>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20 ring-2 ring-white">
                                {user?.ho_va_ten?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 animate-in fade-in duration-500">
                    <AdminRealtimeListener />
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
