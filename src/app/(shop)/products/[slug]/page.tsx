import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './_components/ProductDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportstore.deloydz.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchProduct(slug: string) {
    try {
        const res = await fetch(`${API_URL}/products/${slug}`, {
            next: { revalidate: 300 },
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

// ─── generateMetadata ───────────────────────────────────────────────────────
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const product = await fetchProduct(slug);

    if (!product) {
        return {
            title: 'Không tìm thấy sản phẩm',
            description: 'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        };
    }

    const title = product.ten_san_pham;
    const description = product.mo_ta_ngan
        || `Mua ${product.ten_san_pham} chính hãng tại SportStore. Giao hàng nhanh, đổi trả dễ dàng.`;
    const imagesList = product.hinh_anh ?? product.hinh_anh_san_pham ?? [];
    const ogImage = product.anh_chinh?.url
        || imagesList.find((i: any) => i.la_anh_chinh)?.url
        || imagesList[0]?.url
        || '/og-image.jpg';
    const canonical = `${SITE_URL}/products/${slug}`;
    const price = product.gia_khuyen_mai ?? product.gia_goc;

    return {
        title,
        description,
        keywords: [
            product.ten_san_pham,
            product.thuong_hieu?.ten,
            product.danh_muc?.ten,
            'thể thao', 'chính hãng', 'SportStore',
        ].filter(Boolean),
        alternates: { canonical },
        openGraph: {
            type: 'website',
            locale: 'vi_VN',
            url: canonical,
            siteName: 'SportStore',
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: 800,
                    height: 800,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        other: {
            'product:price:amount': String(price),
            'product:price:currency': 'VND',
            'product:availability': (product.trang_thai === 'hoat_dong') ? 'in stock' : 'out of stock',
        },
    };
}

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
function ProductJsonLd({ product, slug }: { product: any; slug: string }) {
    const imagesList = product.hinh_anh ?? product.hinh_anh_san_pham ?? [];
    const images = imagesList.map((i: any) => i.url || i.duong_dan_anh).filter(Boolean);
    const price = product.gia_khuyen_mai ?? product.gia_goc;
    const canonical = `${SITE_URL}/products/${slug}`;

    const jsonLd: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.ten_san_pham,
        description: product.mo_ta_ngan || product.mo_ta_day_du,
        url: canonical,
        image: images.length > 0 ? images : [`${SITE_URL}/og-image.jpg`],
        sku: product.ma_san_pham || String(product.id),
        offers: {
            '@type': 'Offer',
            url: canonical,
            priceCurrency: 'VND',
            price: String(price),
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: product.trang_thai === 'hoat_dong'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'SportStore',
                url: SITE_URL,
            },
        },
    };

    if (product.thuong_hieu) {
        jsonLd.brand = {
            '@type': 'Brand',
            name: product.thuong_hieu.ten,
        };
    }

    if (product.diem_danh_gia && product.so_luot_danh_gia > 0) {
        jsonLd.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: String(product.diem_danh_gia),
            reviewCount: String(product.so_luot_danh_gia),
            bestRating: '5',
            worstRating: '1',
        };
    }

    // BreadcrumbList
    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: `${SITE_URL}/products` },
            ...(product.danh_muc ? [{
                '@type': 'ListItem',
                position: 3,
                name: product.danh_muc.ten,
                item: `${SITE_URL}/products?danh_muc=${product.danh_muc.duong_dan}`,
            }] : []),
            {
                '@type': 'ListItem',
                position: product.danh_muc ? 4 : 3,
                name: product.ten_san_pham,
                item: canonical,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
        </>
    );
}

// ─── Page (Server Component) ─────────────────────────────────────────────────
export default async function ProductDetailPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const product = await fetchProduct(slug);

    if (!product) notFound();

    return (
        <>
            <ProductJsonLd product={product} slug={slug} />
            <ProductDetailClient params={params} />
        </>
    );
}
