import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportstore.deloydz.com';

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SportStore',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    sameAs: [
        'https://www.facebook.com/sportstore.vn',
        'https://www.instagram.com/sportstore.vn',
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'Vietnamese',
    },
};

const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SportStore',
    url: SITE_URL,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/products?tu_khoa={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
            </div>
        </>
    );
}
