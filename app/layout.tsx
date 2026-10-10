import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#9a5209",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bilimai.dpdns.org"),
  title: {
    default: "BilimAI — Универсальная образовательная ИИ-платформа по 12 предметам · Уроки, Практика, Карта знаний и ЕНТ",
    template: "%s · BilimAI"
  },
  applicationName: "BilimAI",
  description:
    "Универсальная образовательная ИИ-платформа BilimAI на русском, казахском и узбекском языках: пошаговые интерактивные уроки, 8 форматов практики, Лаборатория разбора ошибок, Карта знаний пререквизитов, ИИ-репетитор и тренажёр ЕНТ (ҰБТ) по 12 предметам.",
  keywords: [
    "BilimAI",
    "bilimai.dpdns.org",
    "образовательная ИИ платформа",
    "ИИ репетитор физика математика химия биология",
    "интерактивные уроки по предметам",
    "карта знаний",
    "лаборатория ошибок",
    "подготовка к ЕНТ 12 предметов",
    "ҰБТ дайындық",
    "Sinov UBT"
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
    title: "BilimAI — Универсальная образовательная ИИ-платформа по 12 предметам",
    description:
      "Интерактивные уроки, мультипредметная практика, разбор ошибок по шагам, Карта знаний, ИИ-репетитор и тренажёр ЕНТ на RU / ҚАЗ / OʻZB.",
    url: "https://bilimai.dpdns.org/",
    siteName: "BilimAI",
    type: "website",
    locale: "ru_KZ",
    alternateLocale: ["kk_KZ", "uz_UZ"],
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "BilimAI — Универсальная образовательная ИИ-платформа по 12 предметам"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BilimAI — Универсальная образовательная ИИ-платформа по 12 предметам",
    description:
      "Пошаговые уроки, 8 форматов заданий, Лаборатория ошибок, Карта знаний, ИИ-репетитор и подготовка к ЕНТ на RU / ҚАЗ / OʻZB.",
    images: ["/og-cover.svg"]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://bilimai.dpdns.org/#app",
      name: "BilimAI",
      url: "https://bilimai.dpdns.org/",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      inLanguage: ["ru", "kk", "uz"],
      isAccessibleForFree: true,
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Школьники 5–11 классов, самостоятельные учащиеся, абитуриенты и преподаватели"
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KZT"
      },
      description:
        "Универсальная образовательная ИИ-платформа BilimAI по 12 предметам: интерактивные уроки, практика 8 форматов, Лаборатория ошибок, Карта знаний пререквизитов, ИИ-репетитор и тренажёр ЕНТ."
    },
    {
      "@type": "Course",
      "@id": "https://bilimai.dpdns.org/#course",
      name: "Интерактивные курсы BilimAI по 12 предметам (Школа, Самообразование и ЕНТ)",
      description:
        "Курсы по 12 предметам: Математика, Физика, Информатика, Химия, Биология, География, История Казахстана, Всемирная история, Основы права, Английский язык, Математическая грамотность и Грамотность чтения.",
      provider: {
        "@type": "Organization",
        name: "BilimAI",
        url: "https://bilimai.dpdns.org/"
      },
      inLanguage: ["ru", "kk", "uz"],
      isAccessibleForFree: true
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
