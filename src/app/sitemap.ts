import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportstore.deloydz.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchJson<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            next: { revalidate: 3600 },
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
        { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${SITE_URL}/register`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];

    // Products
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        // Fetch multiple pages of products
        const pages = await Promise.all(
            [1, 2, 3, 4, 5].map(page =>
                fetchJson<{ data: Array<{ duong_dan: string; updated_at: string }> }>(
                    `/products?page=${page}&per_page=50`
                )
            )
        );
        const products = pages
            .flatMap(p => (p as any)?.data ?? p ?? [])
            .filter(Boolean);

        productRoutes = products
            .filter((p: any) => p?.duong_dan)
            .map((p: any) => ({
                url: `${SITE_URL}/products/${p.duong_dan}`,
                lastModified: p.updated_at ? new Date(p.updated_at) : now,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
    } catch { /* ignore */ }

    // Categories
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const categories = await fetchJson<Array<{ duong_dan: string; updated_at: string; danh_muc_con?: any[] }>>(
            '/categories'
        );
        if (Array.isArray(categories)) {
            const allCats = categories.flatMap(cat => [
                cat,
                ...(cat.danh_muc_con ?? []),
            ]);
            categoryRoutes = allCats
                .filter(c => c?.duong_dan)
                .map(c => ({
                    url: `${SITE_URL}/products?danh_muc=${c.duong_dan}`,
                    lastModified: c.updated_at ? new Date(c.updated_at) : now,
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                }));
        }
    } catch { /* ignore */ }

    // Brands
    let brandRoutes: MetadataRoute.Sitemap = [];
    try {
        const brands = await fetchJson<Array<{ duong_dan: string; updated_at: string }>>('/brands');
        if (Array.isArray(brands)) {
            brandRoutes = brands
                .filter(b => b?.duong_dan)
                .map(b => ({
                    url: `${SITE_URL}/products?thuong_hieu=${b.duong_dan}`,
                    lastModified: b.updated_at ? new Date(b.updated_at) : now,
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                }));
        }
    } catch { /* ignore */ }

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
}
