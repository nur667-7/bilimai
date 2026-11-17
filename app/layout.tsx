import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND, BUSINESS_TIERS, STUDY_TIERS } from "@/lib/justslide-data";

export const viewport: Viewport = {
  themeColor: "#2F80FF",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default:
      "JustSlide — студия презентаций в Алматы и Казахстане · от 80 ₸/слайд для учёбы и от 9 900 ₸ для бизнеса",
    template: "%s · JustSlide"
  },
  applicationName: BRAND.name,
  description:
    "Студия презентаций JustSlide (@anelii.y, Анели Продакшн) в Алматы и по всему Казахстану: учебные презентации от 80 ₸/слайд за 15 минут, ҚМЖ 500 ₸, бизнес-редизайн от 9 900 ₸, КП под ключ 19 900 ₸ и Pitch Deck 34 900 ₸. Заказ в WhatsApp +7 700 919 14 02.",
  keywords: [
    "JustSlide",
    "студия презентаций Алматы",
    "студия презентаций Казахстан",
    "презентация на заказ Казахстан",
    "заказать презентацию Алматы Астана",
    "презентация для бизнеса КП Pitch Deck",
    "презентация жасату бағасы",
    "ҚМЖ жасату 500 тг",
    "ашық сабақ презентация",
    "анимациялық презентация жасату",
    "слайды за 15 минут",
    "Анели Продакшн",
    "@anelii.y",
    "anelii.y threads",
    "anelii.y instagram"
  ],
  verification: {
    google: "d2d0fcaf5b36a61d"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large"
    }
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    title:
      "JustSlide — студия презентаций в Казахстане · от 80 ₸/слайд и от 9 900 ₸ для бизнеса",
    description:
      "Журнальный дизайн презентаций без агентских наценок: учёба и ҚМЖ от 15 минут, бизнес КП и Pitch Deck от 4 часов. Threads и Instagram @anelii.y · WhatsApp +7 700 919 14 02.",
    url: `${BRAND.siteUrl}/`,
    siteName: BRAND.name,
    type: "website",
    locale: "ru_KZ",
    alternateLocale: ["kk_KZ"],
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "JustSlide (@anelii.y) — Студия презентаций в Алматы и Казахстане"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JustSlide (@anelii.y) — Просто сильные презентации в Казахстане",
    description:
      "От 80 ₸/слайд за 15 мин для учёбы и от 9 900 ₸ для бизнеса (КП, Pitch Deck). WhatsApp +7 700 919 14 02.",
    images: ["/og-cover.svg"]
  }
};

const allOffers = [...STUDY_TIERS, ...BUSINESS_TIERS];

const rootSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": `${BRAND.siteUrl}/#organization`,
      name: `${BRAND.name} (${BRAND.legacyAlias} / ${BRAND.handle})`,
      alternateName: [
        BRAND.name,
        BRAND.legacyAlias,
        "Aneli Production",
        BRAND.handle,
        "anelii.y"
      ],
      url: `${BRAND.siteUrl}/`,
      logo: `${BRAND.siteUrl}/logo-justslide.svg`,
      telephone: BRAND.phoneE164,
      priceRange: "80–34900 KZT",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Алматы",
        addressCountry: "KZ"
      },
      areaServed: {
        "@type": "Country",
        name: "Kazakhstan"
      },
      availableLanguage: ["Russian", "Kazakh", "English"],
      sameAs: [
        BRAND.threadsUrl,
        BRAND.instagramUrl,
        BRAND.whatsappDirect,
        "https://github.com/nur667-7/aneli-production-kz"
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: BRAND.phoneE164,
          url: BRAND.whatsappDirect,
          availableLanguage: ["Russian", "Kazakh"],
          areaServed: "KZ"
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: BRAND.phoneE164,
          url: BRAND.whatsappDirect,
          availableLanguage: ["Russian", "Kazakh", "English"],
          areaServed: "KZ"
        }
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Услуги студии презентаций JustSlide (@anelii.y)",
        itemListElement: allOffers.map((tier) => ({
          "@type": "Offer",
          priceCurrency: "KZT",
          price: tier.numericPrice,
          availability: "https://schema.org/InStock",
          url: `${BRAND.siteUrl}/order`,
          itemOffered: {
            "@type": "Service",
            name: tier.name,
            description: tier.description,
            areaServed: "KZ"
          }
        }))
      }
    },
    {
      "@type": "WebSite",
      "@id": `${BRAND.siteUrl}/#website`,
      url: `${BRAND.siteUrl}/`,
      name: `${BRAND.name} — Студия презентаций в Казахстане`,
      inLanguage: ["ru-KZ", "kk-KZ"],
      publisher: {
        "@id": `${BRAND.siteUrl}/#organization`
      }
    }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white text-zinc-950 antialiased">
        {children}
      </body>
    </html>
  );
}
