'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Package } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { productService } from '@/services/product.service';
import { Product, ProductImage } from '@/types/product.types';

import { useCategories } from '@/hooks/useCategory';

function resolveProductImageUrl(product: Product): string | null {
    const imagesList: ProductImage[] = product.hinh_anh ?? product.hinh_anh_san_pham ?? [];
    const pick = (img?: ProductImage | null) =>
        img?.url || img?.duong_dan_anh || null;

    return (
        pick(product.anh_chinh) ||
        pick(imagesList.find((img) => img.la_anh_chinh)) ||
        pick(imagesList[0])
    );
}

interface SearchDropdownProps {
    query: string;
    onQueryChange: (query: string) => void;
    trigger: React.ReactNode;
}

export function SearchDropdown({ query, onQueryChange, trigger }: SearchDropdownProps) {
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: categories } = useCategories();

    // Lấy ra các danh mục khớp với từ khóa
    const matchingCategories = categories?.reduce((acc: any[], cat: any) => {
        if (cat.ten.toLowerCase().includes(query.toLowerCase())) {
            acc.push(cat);
        }
        if (cat.danh_muc_con) {
            const subs = cat.danh_muc_con.filter((s: any) => s.ten.toLowerCase().includes(query.toLowerCase()));
            acc.push(...subs);
        }
        return acc;
    }, []).slice(0, 3) || [];

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            setOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setOpen(true);
            try {
                const data = await productService.searchProducts(query, 6);
                setResults(data);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (product: Product) => {
        if (product?.duong_dan) {
            router.push(`/products/${product.duong_dan}`);
            setOpen(false);
            onQueryChange('');
        }
    };

    const handleCategorySelect = (categorySlug: string) => {
        router.push(`/products?category=${categorySlug}`);
        setOpen(false);
        onQueryChange('');
    };

    const handleViewAll = () => {
        router.push(`/products?search=${encodeURIComponent(query)}`);
        setOpen(false);
        onQueryChange('');
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                className="w-[320px] md:w-[400px] p-0 overflow-hidden shadow-xl border-slate-200"
                align="end"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex flex-col bg-white">
                    <div className="max-h-[420px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">
                        {isLoading ? (
                            <div className="py-10 text-center text-sm text-slate-500">
                                <div className="inline-block h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3" />
                                Đang tìm kiếm...
                            </div>
                        ) : query.trim() ? (
                            <>
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    Gợi ý & Từ khóa
                                </div>
                                <div className="p-1">
                                    <button 
                                        onClick={handleViewAll}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-md transition-colors text-left group"
                                    >
                                        <Search className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Tìm với: &quot;{query}&quot;</span>
                                        </div>
                                    </button>

                                    {matchingCategories.map((cat: any) => (
                                        <button 
                                            key={`cat-${cat.id}`} 
                                            onClick={() => handleCategorySelect(cat.duong_dan)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-md transition-colors text-left group"
                                        >
                                            <Package className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                            <div className="flex flex-col">
                                                <span className="text-sm">Bộ sưu tập: <b>{cat.ten}</b></span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {results.length > 0 ? (
                                    <>
                                        <hr className="my-1 border-slate-100" />
                                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                            Sản phẩm khớp nhất
                                        </div>
                                        <div className="p-1">
                                            {results.map((product) => {
                                                const imgSrc = resolveProductImageUrl(product);
                                                return (
                                                    <button
                                                        key={`prod-${product.id}`}
                                                        onClick={() => handleSelect(product)}
                                                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-md transition-colors text-left group"
                                                    >
                                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border flex items-center justify-center">
                                                            {imgSrc ? (
                                                                <Image
                                                                    src={imgSrc}
                                                                    alt={product.ten_san_pham}
                                                                    fill
                                                                    unoptimized
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-5 h-5 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                                                                {product.ten_san_pham}
                                                            </p>
                                                            {product.gia_khuyen_mai ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-primary">
                                                                        {new Intl.NumberFormat('vi-VN').format(product.gia_khuyen_mai)}đ
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 line-through">
                                                                        {new Intl.NumberFormat('vi-VN').format(product.gia_goc)}đ
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs font-semibold text-slate-700">
                                                                    {new Intl.NumberFormat('vi-VN').format(product.gia_goc)}đ
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-center text-sm text-slate-400">
                                        Không tìm thấy sản phẩm phù hợp.
                                    </div>
                                )}

                                <button 
                                    onClick={handleViewAll}
                                    className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-primary font-bold text-[11px] uppercase tracking-wider text-center border-t border-slate-100 transition-colors"
                                >
                                    Xem tất cả kết quả ({results.length})
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
