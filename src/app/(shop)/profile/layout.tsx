'use client';

import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Package, MapPin, Heart, LogOut, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
    { name: 'Thông tin tài khoản', href: '/profile', icon: User },
    { name: 'Thông báo của tôi', href: '/profile/notifications', icon: Bell },
    { name: 'Quản lý đơn hàng', href: '/profile/orders', icon: Package },
    { name: 'Sổ địa chỉ', href: '/profile/addresses', icon: MapPin },
    { name: 'Sản phẩm yêu thích', href: '/profile/wishlist', icon: Heart },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
            router.push('/login');
        }
    }, [isMounted, isAuthenticated, router]);

    // Don't render until hydration is complete to avoid flashes
    if (!isMounted || !isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 bg-slate-50/50 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 sticky top-24">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold uppercase">
                                {user?.ho_va_ten?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 line-clamp-1">{user?.ho_va_ten || 'Tài khoản'}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1">{user?.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1.5 flex flex-col">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.name} href={item.href}>
                                        <div
                                            className={cn(
                                                'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-slate-400")} />
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}

                            <div className="pt-4 mt-2 border-t border-slate-100">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Đăng xuất
                                </Button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 w-full min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
