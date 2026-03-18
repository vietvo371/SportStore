import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportstore.deloydz.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/admin',
                    '/profile/',
                    '/profile',
                    '/checkout/',
                    '/checkout',
                    '/payment/',
                    '/auth/',
                    '/login',
                    '/register',
                    '/verify-email',
                    '/api/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/profile/',
                    '/checkout/',
                    '/payment/',
                    '/auth/',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
