import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bestore.deloydz.com', pathname: '/**' },
      { protocol: 'https', hostname: 'wikasports.com', pathname: '/**' },
      { protocol: 'https', hostname: 'shop.webthethao.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'maxsportnutrition.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.ketnoibongda.vn', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost', port: '8000', pathname: '/**' },
      { protocol: 'http',  hostname: '127.0.0.1', port: '8000', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Block all crawlers from admin & private routes
      {
        source: '/admin/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/profile/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/checkout/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(ico|png|svg|jpg|jpeg|webp|avif|woff2|woff|ttf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
