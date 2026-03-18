'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    LayoutGrid,
    ShoppingCart,
    Star,
    Ticket,
    Users,
    Home,
    BarChart3,
    Image as ImageIcon,
    Bell as BellIcon,
    ShieldCheck,
    LogOut,
    UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Sản phẩm', href: '/admin/products', icon: Package },
    { name: 'Danh mục', href: '/admin/catalog', icon: LayoutGrid },
    { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Đánh giá', href: '/admin/reviews', icon: Star },
    { name: 'Mã giảm giá', href: '/admin/coupons', icon: Ticket },
    { name: 'Khách hàng', href: '/admin/users', icon: Users },
    { name: 'Phân quyền', href: '/admin/roles', icon: ShieldCheck },
    { name: 'Xếp hạng & Thống kê', href: '/admin/reports', icon: BarChart3 },
    { name: 'Banner', href: '/admin/banners', icon: ImageIcon },
    { name: 'Thông báo', href: '/admin/notifications', icon: BellIcon },
];

interface AdminSidebarProps {
    className?: string;
    setOpen?: (open: boolean) => void;
}

export function AdminSidebar({ className, setOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    const handleLinkClick = () => {
        if (setOpen) setOpen(false);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside className={cn("w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800", className)}>
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">
                        SPORTSTORE <span className="text-[10px] text-primary block mt-0.5 font-black uppercase tracking-widest">Admin Portal</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 ring-1 ring-primary-foreground/10"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-800 space-y-1">
                <Link
                    href="/admin/profile"
                    onClick={handleLinkClick}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        pathname === '/admin/profile'
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "hover:bg-slate-800 hover:text-white text-slate-400"
                    )}
                >
                    <UserCircle className="h-5 w-5" />
                    Hồ sơ của tôi
                </Link>
                <Link
                    href="/"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition-all text-slate-400"
                >
                    <Home className="h-5 w-5" />
                    Quay lại Cửa hàng
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-rose-500/10 hover:text-rose-400 transition-all text-slate-400 text-left"
                >
                    <LogOut className="h-5 w-5" />
                    Đăng xuất
                </button>
                <div className="px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30 mt-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Phiên bản</p>
                    <p className="text-xs text-slate-400 font-medium">SportStore v1.0.4</p>
                </div>
            </div>
        </aside>
    );
}
