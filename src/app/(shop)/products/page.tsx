'use client';

import { Suspense, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategory';
import { useBrands } from '@/services/brand.service';
import { Brand } from '@/types/brand.types';
import { ArrowLeft, ArrowUpDown, SlidersHorizontal, Tag, PackageCheck, RotateCcw, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá: Thấp → Cao' },
    { value: 'price_desc', label: 'Giá: Cao → Thấp' },
    { value: 'popular', label: 'Bán chạy nhất' },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // ── URL Params ──────────────────────────────────────────────────
    const page       = Number(searchParams.get('page')) || 1;
    const category    = searchParams.get('category') || '';
    const brand      = searchParams.get('brand') || '';
    const search     = searchParams.get('search') || '';
    const parsePrice = (val: string | null) => {
        if (!val || val === 'null') return undefined;
        const n = Number(val);
        return isNaN(n) ? undefined : n;
    };
    const minPrice    = parsePrice(searchParams.get('minPrice'));
    const maxPrice    = parsePrice(searchParams.get('maxPrice'));
    const sort        = (searchParams.get('sort') as SortOption) || 'newest';
    const saleOnly    = searchParams.get('sale') === '1';
    const inStockOnly = searchParams.get('stock') === '1';

    // ── Local UI state ──────────────────────────────────────────────
    const [priceRange, setPriceRange] = useState<[number, number]>([
        minPrice || 0,
        maxPrice || 5_000_000,
    ]);
    const [showFilters, setShowFilters] = useState(false);

    // Sync slider when URL changes
    useEffect(() => {
        setPriceRange([minPrice || 0, maxPrice || 5_000_000]);
    }, [minPrice, maxPrice]);

    // ── Data ────────────────────────────────────────────────────────
    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const { data: brands, isLoading: brandsLoading } = useBrands();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', { page, category, brand, search, minPrice, maxPrice, sort, saleOnly, inStockOnly }],
        queryFn: () =>
            productService.getProducts({
                page,
                category,
                brand,
                search,
                minPrice,
                maxPrice,
                sort,
                limit: 12,
                saleOnly,
                inStockOnly,
            }),
    });

    // ── Helpers ─────────────────────────────────────────────────────
    const hasActiveFilters = !!(category || brand || search || minPrice !== undefined || maxPrice !== undefined || saleOnly || inStockOnly);

    const buildUrl = useCallback((overrides: Record<string, string | number | boolean | undefined | null>) => {
        const params: Record<string, string> = {};

        const set = (key: string, value: string | number | boolean | undefined | null) => {
            if (value != null && value !== '' && value !== false) {
                params[key] = String(value);
            }
        };

        const catVal    = overrides.category === null ? undefined : (overrides.category ?? (category || undefined));
        const brandVal  = overrides.brand    === null ? undefined : (overrides.brand    ?? (brand    || undefined));
        const searchVal = overrides.search   === null ? undefined : (overrides.search   ?? (search   || undefined));

        set('category', catVal);
        set('brand',    brandVal);
        set('search',   searchVal);
        set('sort',     overrides.sort     ?? (sort     || undefined));
        set('sale',     overrides.sale !== undefined ? overrides.sale : (saleOnly ? '1' : undefined));
        set('stock',    overrides.stock !== undefined ? overrides.stock : (inStockOnly ? '1' : undefined));

        const minVal = overrides.minPrice;
        const maxVal = overrides.maxPrice;
        if (minVal !== undefined && minVal !== null) {
            params.minPrice = String(minVal);
        } else if (minPrice !== undefined && minPrice !== null) {
            // Only keep URL value if overrides didn't explicitly say "remove"
            // (overrides === {} means keep; overrides.minPrice === null means remove)
        }
        if (maxVal !== undefined && maxVal !== null) {
            params.maxPrice = String(maxVal);
        } else if (maxPrice !== undefined && maxPrice !== null) {
            // Only keep URL value if overrides didn't explicitly say "remove"
        }

        const pageVal = overrides.page !== undefined ? Number(overrides.page) : page;
        if (pageVal > 1) params.page = String(pageVal);

        const qs = new URLSearchParams(params).toString();
        return `${pathname}${qs ? '?' + qs : ''}`;
    }, [pathname, category, brand, search, sort, saleOnly, inStockOnly, minPrice, maxPrice, page]);

    const resetAllFilters = () => {
        setPriceRange([0, 5_000_000]);
        router.push(pathname);
    };

    const removeFilter = (key: string) => {
        console.log('[removeFilter] key:', key, 'current URL:', window.location.href);
        if (key === 'category') router.push(buildUrl({ category: null }));
        else if (key === 'brand')    router.push(buildUrl({ brand: null }));
        else if (key === 'search')   router.push(buildUrl({ search: null }));
        else if (key === 'price')    router.push(buildUrl({ minPrice: null, maxPrice: null }));
        else if (key === 'sale')     router.push(buildUrl({ sale: null }));
        else if (key === 'stock')    router.push(buildUrl({ stock: null }));
    };

    // ── Handlers ────────────────────────────────────────────────────
    const handlePriceApply = () => {
        const min = priceRange[0] === 0 ? null : priceRange[0];
        const max = priceRange[1] === 5_000_000 ? null : priceRange[1];
        router.push(buildUrl({ minPrice: min, maxPrice: max, page: 1 }));
    };

    const handleBrandClick = (slug: string) => {
        const newBrand = brand === slug ? null : slug;
        // Reset price & search when switching brand
        setPriceRange([0, 5_000_000]);
        router.push(buildUrl({ brand: newBrand, search: null, minPrice: null, maxPrice: null, page: 1 }));
    };

    const handleCategoryClick = (slug: string) => {
        const newCat = category === slug ? null : slug;
        router.push(buildUrl({ category: newCat, page: 1 }));
    };

    // ── Computed ────────────────────────────────────────────────────
    const products = data?.data || [];
    const meta = data?.meta;

    const activeFilterChips: { key: string; label: string }[] = [];
    if (category) {
        const cat = categories?.find((c: any) => c.duong_dan === category)
            || categories?.flatMap((c: any) => c.danh_muc_con || []).find((c: any) => c.duong_dan === category);
        activeFilterChips.push({ key: 'category', label: cat ? `Danh mục: ${cat.ten}` : category });
    }
    if (brand) {
        activeFilterChips.push({ key: 'brand', label: `Thương hiệu: ${brands?.find((b: Brand) => b.duong_dan === brand)?.ten ?? brand}` });
    }
    if (search) {
        activeFilterChips.push({ key: 'search', label: `Tìm: "${search}"` });
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        const min = minPrice !== undefined ? formatCurrency(minPrice) : '0đ';
        const max = maxPrice !== undefined ? formatCurrency(maxPrice) : '∞';
        activeFilterChips.push({ key: 'price', label: `Giá: ${min} – ${max}` });
    }
    if (saleOnly)    activeFilterChips.push({ key: 'sale',  label: 'Chỉ giảm giá' });
    if (inStockOnly) activeFilterChips.push({ key: 'stock', label: 'Còn hàng' });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* ── Sidebar Filters ── */}
                <div className={cn(
                    "w-full md:w-64 shrink-0",
                    showFilters ? 'block' : 'hidden md:block'
                )}>
                    <div className="sticky top-24 bg-white p-4 rounded-xl border space-y-6">

                        {/* Quick Filters */}
                        <div className="border-t pt-5">
                            <h3 className="font-bold text-base uppercase tracking-wider mb-4">
                                LỌC NHANH
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { console.log('[SALE] click, saleOnly:', saleOnly); router.push(buildUrl({ sale: saleOnly ? null : '1', page: 1 })); }}
                                    className={cn(
                                        'w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm transition-all border',
                                        saleOnly
                                            ? 'bg-red-50 border-red-200 text-red-600 font-semibold'
                                            : 'border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50/50'
                                    )}
                                >
                                    <Tag className="h-4 w-4 shrink-0" />
                                    <span>Giảm giá</span>
                                    {saleOnly && <X className="h-3 w-3 ml-auto" />}
                                </button>
                                <button
                                    onClick={() => { console.log('[STOCK] click, inStockOnly:', inStockOnly); router.push(buildUrl({ stock: inStockOnly ? null : '1', page: 1 })); }}
                                    className={cn(
                                        'w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm transition-all border',
                                        inStockOnly
                                            ? 'bg-green-50 border-green-200 text-green-600 font-semibold'
                                            : 'border-slate-200 text-slate-600 hover:border-green-200 hover:bg-green-50/50'
                                    )}
                                >
                                    <PackageCheck className="h-4 w-4 shrink-0" />
                                    <span>Còn hàng</span>
                                    {inStockOnly && <X className="h-3 w-3 ml-auto" />}
                                </button>
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="border-t pt-5">
                            <div className="flex flex-col mb-6">
                                <h3 className="font-bold text-base uppercase tracking-wider mb-1">
                                    LỌC THEO GIÁ
                                </h3>
                                <div className="w-10 h-[3px] bg-slate-900 rounded-full" />
                            </div>
                            <div className="px-1.5 space-y-6">
                                <Slider
                                    max={10_000_000}
                                    step={50_000}
                                    value={[priceRange[0], priceRange[1]]}
                                    onValueChange={(value) => setPriceRange(value as [number, number])}
                                    className="my-6"
                                />
                                <div className="flex items-center justify-between gap-4">
                                    <Button
                                        onClick={handlePriceApply}
                                        className="h-9 px-6 bg-slate-600 hover:bg-slate-700 text-white rounded-full text-xs font-bold uppercase transition-all"
                                    >
                                        Lọc
                                    </Button>
                                    <div className="text-[13px] font-medium text-slate-700">
                                        <span className="text-slate-500 mr-1">Giá:</span>
                                        <span className="font-semibold underline">
                                            {formatCurrency(priceRange[0])} — {formatCurrency(priceRange[1])}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="border-t pt-5">
                            <h3 className="font-semibold mb-4 text-lg">Danh Mục</h3>
                            {categoriesLoading ? (
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
                                </div>
                            ) : (
                                <ul className="space-y-3 text-sm flex flex-col max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    <li>
                                        <button
                                            onClick={() => handleCategoryClick('')}
                                            className={`transition-colors block py-2 w-full text-left ${!category ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}
                                        >
                                            Tất cả sản phẩm
                                        </button>
                                    </li>
                                    {categories?.map((cat: any) => (
                                        <li key={cat.id} className="flex flex-col gap-1.5 pb-2 border-b border-slate-50 last:border-0">
                                            <button
                                                onClick={() => handleCategoryClick(cat.duong_dan)}
                                                className={`transition-colors block py-0.5 w-full text-left ${category === cat.duong_dan ? 'text-primary font-bold' : 'text-slate-800 font-semibold hover:text-primary'}`}
                                            >
                                                {cat.ten}
                                            </button>
                                            {cat.danh_muc_con && cat.danh_muc_con.length > 0 && (
                                                <ul className="pl-3.5 border-l-[1.5px] border-slate-200 space-y-1.5 ml-1 mt-1 flex flex-col">
                                                    {cat.danh_muc_con.map((child: any) => (
                                                        <li key={child.id}>
                                                            <button
                                                                onClick={() => handleCategoryClick(child.duong_dan)}
                                                                className={`transition-colors block py-0.5 text-[13px] w-full text-left ${category === child.duong_dan ? 'text-primary font-semibold' : 'text-slate-500 hover:text-primary'}`}
                                                            >
                                                                {child.ten}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Brand Filter */}
                        <div className="border-t pt-5">
                            <h3 className="font-semibold mb-4 text-lg">Thương Hiệu</h3>
                            {brandsLoading ? (
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                                </div>
                            ) : (
                                <ul className="space-y-1.5 text-sm max-h-[35vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    {brands?.map((b: Brand) => (
                                        <li key={b.id}>
                                            <button
                                                onClick={() => handleBrandClick(b.duong_dan)}
                                                className={`w-full text-left flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-colors ${brand === b.duong_dan
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                                                    }`}
                                            >
                                                {b.logo_url && (
                                                    <img src={b.logo_url} alt={b.ten} className="w-5 h-5 object-contain rounded-sm shrink-0" />
                                                )}
                                                <span>{b.ten}</span>
                                                {brand === b.duong_dan && (
                                                    <span className="ml-auto text-xs">✕</span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Product Grid ── */}
                <div className="flex-1 min-w-0">
                    {/* Header: title + sort + clear */}
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {category && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(buildUrl({ category: null }))}
                                    className="text-slate-500 hover:text-slate-900 pl-0 gap-1.5 shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Quay lại
                                </Button>
                            )}
                            <h1 className="text-xl sm:text-2xl font-bold truncate">
                                {search
                                    ? `Tìm kiếm: "${search}"`
                                    : category
                                        ? (() => {
                                            const cat = categories?.find((c: any) => c.duong_dan === category)
                                                || categories?.flatMap((c: any) => c.danh_muc_con || []).find((c: any) => c.duong_dan === category);
                                            return cat ? `Danh mục: ${cat.ten}` : category;
                                        })()
                                        : brand
                                            ? `Thương Hiệu: ${brands?.find((b: Brand) => b.duong_dan === brand)?.ten ?? brand}`
                                            : 'Tất Cả Sản Phẩm'}
                            </h1>
                        </div>

                        {/* Sort + Mobile filter toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="md:hidden gap-1.5"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Lọc</span>
                            </Button>
                            <Select
                                value={sort}
                                onValueChange={(v) => router.push(buildUrl({ sort: v, page: 1 }))}
                            >
                                <SelectTrigger className="h-9 w-auto min-w-[160px] text-sm gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    {hasActiveFilters && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {activeFilterChips.map((chip) => (
                                <span
                                    key={chip.key}
                                    onClick={() => { console.log('[CHIP] clicked key:', chip.key, 'label:', chip.label); removeFilter(chip.key); }}
                                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200 cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors select-none"
                                >
                                    <span className="truncate max-w-[140px]">{chip.label}</span>
                                    <span className="shrink-0 text-base leading-none" aria-hidden="true"><X className="h-3 w-3" /></span>
                                </span>
                            ))}
                            <button
                                type="button"
                                onClick={resetAllFilters}
                                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors px-2 py-1.5 rounded-full hover:bg-red-50"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Xóa lọc
                            </button>
                        </div>
                    )}

                    {/* Result count */}
                    <p className="text-sm text-muted-foreground mb-4">
                        {meta ? `Hiển thị ${products.length} / ${meta.total} sản phẩm` : ''}
                    </p>

                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl" />
                                    <div className="w-2/3 h-4 bg-slate-100 animate-pulse rounded mt-2" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-destructive">
                            Lỗi tải dữ liệu sản phẩm. Vui lòng thử lại.
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {products.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {/* Pagination — keeps ALL active params including sort */}
                            {meta && meta.last_page > 1 && (
                                <div className="flex justify-center mt-12 gap-2">
                                    <Button variant="outline" disabled={meta.current_page === 1}>
                                        <a href={buildUrl({ page: meta.current_page - 1 })}>Trước</a>
                                    </Button>
                                    <span className="flex items-center px-4 font-medium">
                                        Trang {meta.current_page} / {meta.last_page}
                                    </span>
                                    <Button variant="outline" disabled={meta.current_page === meta.last_page}>
                                        <a href={buildUrl({ page: meta.current_page + 1 })}>Sau</a>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-xl">
                            <p className="text-lg text-muted-foreground mb-4">Không tìm thấy sản phẩm nào phù hợp.</p>
                            <Button variant="outline" onClick={resetAllFilters} className="gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Xóa lọc & Thử lại
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading products...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
