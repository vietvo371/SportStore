'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategory';

function ProductsContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', { page, category, search }],
        queryFn: () => productService.getProducts({
            page,
            category,
            search,
            limit: 12
        }),
    });

    const products = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="sticky top-24 bg-white p-4 rounded-xl border">
                        <h3 className="font-semibold mb-4 text-lg">Danh Mục</h3>
                        {categoriesLoading ? (
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
                            </div>
                        ) : (
                            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col max-h-[60vh] overflow-y-auto pr-2">
                                <li>
                                    <a
                                        href="/products"
                                        className={`transition-colors block py-1 ${!category ? 'text-primary font-semibold' : 'hover:text-primary'}`}
                                    >
                                        Tất cả sản phẩm
                                    </a>
                                </li>
                                {categories?.map((cat: any) => (
                                    <li key={cat.id}>
                                        <a
                                            href={`/products?category=${cat.duong_dan}`}
                                            className={`transition-colors block py-1 ${category === cat.duong_dan ? 'text-primary font-semibold' : 'hover:text-primary'}`}
                                        >
                                            {cat.ten}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            {category ? `Danh Mục: ${category}` : search ? `Tìm kiếm: "${search}"` : 'Tất Cả Sản Phẩm'}
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
                                        <a href={`/products?page=${meta.current_page - 1}${category ? '&category=' + category : ''}`}>
                                            Trước
                                        </a>
                                    </Button>
                                    <span className="flex items-center px-4 font-medium">
                                        Trang {meta.current_page} / {meta.last_page}
                                    </span>
                                    <Button variant="outline" disabled={meta.current_page === meta.last_page}>
                                        <a href={`/products?page=${meta.current_page + 1}${category ? '&category=' + category : ''}`}>
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
