import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportstore.deloydz.com';

export const metadata: Metadata = {
    title: 'Tất cả Sản phẩm Thể thao',
    description: 'Khám phá hàng nghìn sản phẩm thể thao chính hãng — áo, quần, giày, phụ kiện Nike, Adidas, Puma, Under Armour. Lọc theo danh mục, thương hiệu, giá cả.',
    keywords: [
        'sản phẩm thể thao', 'trang phục thể thao', 'giày thể thao',
        'phụ kiện thể thao', 'Nike', 'Adidas', 'Puma', 'SportStore',
        'mua sắm thể thao online',
    ],
    alternates: {
        canonical: `${SITE_URL}/products`,
    },
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: `${SITE_URL}/products`,
        siteName: 'SportStore',
        title: 'Tất cả Sản phẩm Thể thao | SportStore',
        description: 'Khám phá hàng nghìn sản phẩm thể thao chính hãng — Nike, Adidas, Puma, Under Armour và nhiều thương hiệu uy tín khác.',
        images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'SportStore — Sản phẩm thể thao' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tất cả Sản phẩm Thể thao | SportStore',
        description: 'Khám phá hàng nghìn sản phẩm thể thao chính hãng.',
        images: ['/og-image.jpg'],
    },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
