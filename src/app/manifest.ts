import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SportStore — Trang phục & Phụ kiện Thể thao',
        short_name: 'SportStore',
        description: 'Cửa hàng trang phục & phụ kiện thể thao chính hãng',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        orientation: 'portrait',
        lang: 'vi',
        categories: ['shopping', 'sport'],
        icons: [
            { src: '/sportstore-logo.png?v=logo-new', sizes: 'any', type: 'image/png' },
            { src: '/sportstore-logo.png?v=logo-new', sizes: '192x192', type: 'image/png' },
            { src: '/sportstore-logo.png?v=logo-new', sizes: '512x512', type: 'image/png' },
            { src: '/sportstore-logo.png?v=logo-new', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
            {
                src: '/og-image.jpg',
                sizes: '1200x630',
                type: 'image/jpeg',
            },
        ],
    };
}
