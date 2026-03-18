'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategory';
import { useBrands } from '@/services/brand.service';
import { Brand } from '@/types/brand.types';

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const search = searchParams.get('search') || '';

    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const { data: brands, isLoading: brandsLoading } = useBrands();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', { page, category, brand, search }],
        queryFn: () => productService.getProducts({
            page,
            category,
            brand,
            search,
            limit: 12
        }),
    });

    const buildUrl = (params: Record<string, string | number | undefined>) => {
        const current = new URLSearchParams();
        if (params.category) current.set('category', String(params.category));
        if (params.brand) current.set('brand', String(params.brand));
        if (params.search) current.set('search', String(params.search));
        if (params.page && Number(params.page) > 1) current.set('page', String(params.page));
        const qs = current.toString();
        return `${pathname}${qs ? '?' + qs : ''}`;
    };

    const handleBrandClick = (brandSlug: string) => {
        const newBrand = brand === brandSlug ? '' : brandSlug;
        router.push(buildUrl({ category, brand: newBrand, search }));
    };

    const products = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="sticky top-24 bg-white p-4 rounded-xl border space-y-6">
                        {/* Category Filter */}
                        <div>
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
                                        <a
                                            href={buildUrl({ brand, search })}
                                            className={`transition-colors block py-2 ${!category ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}
                                        >
                                            Tất cả sản phẩm
                                        </a>
                                    </li>
                                    {categories?.map((cat: any) => (
                                        <li key={cat.id} className="flex flex-col gap-1.5 pb-2 border-b border-slate-50 last:border-0">
                                            <a
                                                href={buildUrl({ category: cat.duong_dan, brand, search })}
                                                className={`transition-colors block py-0.5 ${category === cat.duong_dan ? 'text-primary font-bold' : 'text-slate-800 font-semibold hover:text-primary'}`}
                                            >
                                                {cat.ten}
                                            </a>
                                            {cat.danh_muc_con && cat.danh_muc_con.length > 0 && (
                                                <ul className="pl-3.5 border-l-[1.5px] border-slate-200 space-y-1.5 ml-1 mt-1 flex flex-col relative before:content-[''] before:absolute before:-top-2 before:left-[-1.5px] before:w-[1.5px] before:h-2 before:bg-slate-200">
                                                    {cat.danh_muc_con.map((child: any) => (
                                                        <li key={child.id} className="relative before:content-[''] before:absolute before:left-[-15px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1.5px] before:bg-slate-200">
                                                            <a
                                                                href={buildUrl({ category: child.duong_dan, brand, search })}
                                                                className={`transition-colors block py-0.5 text-[13px] ${category === child.duong_dan ? 'text-primary font-semibold' : 'text-slate-500 hover:text-primary'}`}
                                                            >
                                                                {child.ten}
                                                            </a>
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
                                                className={`w-full text-left flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-colors ${
                                                    brand === b.duong_dan
                                                        ? 'bg-primary/10 text-primary font-semibold'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                                                }`}
                                            >
                                                {b.logo && (
                                                    <img
                                                        src={b.logo}
                                                        alt={b.ten}
                                                        className="w-5 h-5 object-contain rounded-sm shrink-0"
                                                    />
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

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            {search
                                ? `Tìm kiếm: "${search}"`
                                : category
                                    ? `Danh Mục: ${category}`
                                    : brand
                                        ? `Thương Hiệu: ${brands?.find((b: Brand) => b.duong_dan === brand)?.ten ?? brand}`
                                        : 'Tất Cả Sản Phẩm'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {meta ? `Hiển thị ${products.length} trên tổng ${meta.total} sản phẩm` : ''}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl" />
                                    <div className="w-2/3 h-4 bg-slate-100 animate-pulse rounded mt-2" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-destructive">Lỗi tải dữ liệu sản phẩm. Vui lòng thử lại.</div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {products.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {meta && meta.last_page > 1 && (
                                <div className="flex justify-center mt-12 gap-2">
                                    <Button variant="outline" disabled={meta.current_page === 1}>
                                        <a href={buildUrl({ category, brand, search, page: meta.current_page - 1 })}>
                                            Trước
                                        </a>
                                    </Button>
                                    <span className="flex items-center px-4 font-medium">
                                        Trang {meta.current_page} / {meta.last_page}
                                    </span>
                                    <Button variant="outline" disabled={meta.current_page === meta.last_page}>
                                        <a href={buildUrl({ category, brand, search, page: meta.current_page + 1 })}>
                                            Sau
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-xl">
                            <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
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
