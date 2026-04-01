'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, LogOut, Package, Heart, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

import { useCategories } from '@/hooks/useCategory';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { toast } from 'sonner';

export function Header() {
    const { itemCount, openCart } = useCartStore();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { data: categories } = useCategories();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Đăng xuất thành công!');
        router.push('/login');
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80vw] sm:max-w-sm flex flex-col pt-10 px-0">
                                <SheetTitle className="px-6 text-xl text-primary font-bold">Danh Mục</SheetTitle>
                                <SheetDescription className="sr-only">Menu phụ cho thiết bị di động</SheetDescription>

                                <div className="flex-1 overflow-y-auto mt-4">
                                    <div className="flex flex-col">
                                        <SheetClose asChild>
                                            <Link href="/products" className="px-6 py-3 text-base font-medium border-b hover:bg-slate-50 transition-colors">
                                                Tất cả sản phẩm
                                            </Link>
                                        </SheetClose>

                                        {(user?.vai_tro === 'quan_tri' || user?.cac_vai_tro?.some((r: any) => r.ma_slug !== 'customer')) && (
                                            <SheetClose asChild>
                                                <Link href="/admin" className="px-6 py-3 text-base font-bold text-primary border-b hover:bg-slate-50 transition-colors">
                                                    Quản trị hệ thống
                                                </Link>
                                            </SheetClose>
                                        )}

                                        {categories && categories.length > 0 ? (
                                            categories.map((cat: any) => (
                                                <div key={cat.id} className="flex flex-col border-b">
                                                    <SheetClose asChild>
                                                        <Link
                                                            href={`/products?category=${cat.duong_dan}`}
                                                            className="px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-between"
                                                        >
                                                            <span>{cat.ten}</span>
                                                        </Link>
                                                    </SheetClose>

                                                    {/* Nhánh danh mục con */}
                                                    {cat.danh_muc_con && cat.danh_muc_con.length > 0 && (
                                                        <div className="flex flex-col bg-slate-50/30 pb-2">
                                                            {cat.danh_muc_con.map((child: any) => (
                                                                <SheetClose asChild key={child.id}>
                                                                    <Link
                                                                        href={`/products?category=${child.duong_dan}`}
                                                                        className="pl-10 pr-6 py-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors relative before:content-[''] before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-slate-400 before:rounded-full hover:before:bg-primary"
                                                                    >
                                                                        {child.ten}
                                                                    </Link>
                                                                </SheetClose>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-6 py-4 text-sm text-slate-500 border-b">Đang tải danh mục...</div>
                                        )}

                                        <SheetClose asChild>
                                            <Link href="/#brands" className="px-6 py-3 text-base font-medium border-b hover:bg-slate-50 transition-colors">
                                                Thương hiệu
                                            </Link>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <div className="flex justify-center md:justify-start">
                        <Link href="/" className="flex items-center group">
                            <div className="relative w-28 h-13 md:w-32 md:h-15 overflow-hidden transition-transform group-hover:scale-105">
                                <Image src="/sportstore-logo.png" alt="SportStore Logo" fill className="object-contain" sizes="(max-width: 768px) 128px, 144px" priority />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/products" className="transition-colors hover:text-primary">
                            Tất cả sản phẩm
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary focus:outline-none data-[state=open]:text-primary">
                                Danh mục
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[2px] opacity-70"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 max-h-[400px] overflow-y-auto" align="start">
                                {categories && categories.length > 0 ? (
                                    categories.map((cat: any) => (
                                        cat.danh_muc_con && cat.danh_muc_con.length > 0 ? (
                                            <DropdownMenuSub key={cat.id}>
                                                <DropdownMenuSubTrigger className="cursor-pointer font-medium hover:bg-slate-50 py-2.5">
                                                    {cat.ten}
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent className="w-48 max-h-[300px] overflow-y-auto z-[100] shadow-md border-slate-100 p-2">
                                                        <DropdownMenuItem asChild className="cursor-pointer border-b border-slate-100 font-semibold text-primary pb-2 rounded-none mb-1">
                                                            <Link href={`/products?category=${cat.duong_dan}`}>
                                                                Tất cả {cat.ten}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {cat.danh_muc_con.map((child: any) => (
                                                            <DropdownMenuItem key={child.id} asChild className="cursor-pointer py-2 hover:text-primary transition-colors focus:bg-slate-50 focus:text-primary">
                                                                <Link href={`/products?category=${child.duong_dan}`}>
                                                                    {child.ten}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        ) : (
                                            <DropdownMenuItem key={cat.id} asChild className="cursor-pointer font-medium hover:bg-slate-50 py-2.5">
                                                <Link href={`/products?category=${cat.duong_dan}`}>
                                                    {cat.ten}
                                                </Link>
                                            </DropdownMenuItem>
                                        )
                                    ))
                                ) : (
                                    <div className="p-4 text-sm text-slate-500 text-center animate-pulse">Đang tải danh mục...</div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/#brands" className="transition-colors hover:text-primary">
                            Thương hiệu
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="hidden sm:flex items-center relative gap-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 lg:w-64 h-9 px-3 pr-10 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            />
                            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 h-9 w-9 text-slate-500 hover:text-primary hover:bg-transparent rounded-r-full">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        {isMounted && (
                            isAuthenticated ? (
                                <div className="flex items-center gap-2">
                                    <NotificationCenter />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-slate-200">
                                                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-primary">
                                                    {user?.ho_va_ten?.charAt(0) || 'U'}
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                            <div className="flex flex-col space-y-1 p-2 border-b border-slate-100 mb-1">
                                                <p className="text-sm font-medium leading-none text-slate-800">{user?.ho_va_ten}</p>
                                                <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                                                {(user?.cac_vai_tro?.filter((r: any) => r.ma_slug !== 'customer')?.length ?? 0) > 0 && (
                                                    <p className="text-[10px] font-semibold text-primary mt-1">
                                                        {user?.cac_vai_tro?.filter((r: any) => r.ma_slug !== 'customer')?.map((r: any) => r.ten).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                            {(user?.vai_tro === 'quan_tri' || user?.cac_vai_tro?.some((r: any) => r.ma_slug !== 'customer')) ? (
                                                <>
                                                    <DropdownMenuItem asChild className="cursor-pointer py-2 text-primary font-semibold">
                                                        <Link href="/admin" className="flex items-center w-full">
                                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                                            <span>Quản trị hệ thống</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50 mt-1">
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        <span>Đăng xuất</span>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <>
                                                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                                                        <Link href="/profile" className="flex items-center w-full">
                                                            <User className="mr-2 h-4 w-4 text-slate-500" />
                                                            <span>Tài khoản của tôi</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                                                        <Link href="/profile/orders" className="flex items-center w-full">
                                                            <Package className="mr-2 h-4 w-4 text-slate-500" />
                                                            <span>Đơn mua</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                                                        <Link href="/profile/wishlist" className="flex items-center w-full">
                                                            <Heart className="mr-2 h-4 w-4 text-slate-500" />
                                                            <span>Sản phẩm yêu thích</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50 mt-1">
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        <span>Đăng xuất</span>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button variant="ghost" size="icon" aria-label="Tài khoản">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Giỏ hàng"
                            className="relative"
                            onClick={openCart}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
