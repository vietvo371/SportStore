'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Package } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { productService } from '@/services/product.service';
import { Product, ProductImage } from '@/types/product.types';

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

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await productService.searchProducts(query, 8);
                setResults(data);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!query.trim()) {
            setOpen(false);
        }
    }, [query]);

    const handleSelect = (product: Product) => {
        if (product?.duong_dan) {
            router.push(`/products/${product.duong_dan}`);
            setOpen(false);
            onQueryChange('');
        }
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
                className="w-[400px] p-0"
                align="end"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Command shouldFilter={false} className="rounded-lg border-none shadow-none">
                    <CommandInput
                        placeholder="Tìm kiếm sản phẩm..."
                        value={query}
                        onValueChange={onQueryChange}
                        className="h-11 border-b"
                    />

                    <CommandList className="max-h-[360px]">
                        {isLoading ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                <div className="inline-block h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                                Đang tìm kiếm...
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                <CommandGroup heading="Sản phẩm">
                                    {results.map((product) => {
                                        const imgSrc = resolveProductImageUrl(product);
                                        return (
                                        <CommandItem
                                            key={product.id}
                                            value={product.ten_san_pham}
                                            onSelect={() => handleSelect(product)}
                                            className="flex items-center gap-3 py-3 cursor-pointer"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border flex items-center justify-center">
                                                {imgSrc ? (
                                                    <Image
                                                        src={imgSrc}
                                                        alt={product.ten_san_pham}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-6 h-6 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">
                                                    {product.ten_san_pham}
                                                </p>
                                                {product.gia_khuyen_mai ? (
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-sm font-bold text-primary">
                                                            {new Intl.NumberFormat('vi-VN').format(product.gia_khuyen_mai)}đ
                                                        </span>
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            {new Intl.NumberFormat('vi-VN').format(product.gia_goc)}đ
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-semibold text-foreground mt-0.5">
                                                        {new Intl.NumberFormat('vi-VN').format(product.gia_goc)}đ
                                                    </p>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                    })}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandItem onSelect={handleViewAll} className="cursor-pointer justify-center text-primary font-semibold text-sm py-2.5">
                                    <Search className="h-4 w-4 mr-2" />
                                    Xem tất cả kết quả cho &quot;{query}&quot;
                                </CommandItem>
                            </>
                        ) : query.trim() ? (
                            <>
                                <CommandEmpty className="py-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                                            <Search className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="font-semibold text-sm">Không tìm thấy kết quả</p>
                                        <p className="text-xs text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
                                    </div>
                                </CommandEmpty>
                                <CommandItem onSelect={handleViewAll} className="cursor-pointer justify-center text-primary font-semibold text-sm py-2.5">
                                    Xem tất cả sản phẩm
                                </CommandItem>
                            </>
                        ) : null}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
