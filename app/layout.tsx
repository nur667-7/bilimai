import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1b3b6f",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bilimai.dpdns.org"),
  title: {
    default: "BilimAI — Математика ЕНТ (ҰБТ) · Пошаговый разбор, пробный тест и тренажёр ошибок",
    template: "%s · BilimAI"
  },
  applicationName: "BilimAI",
  description:
    "Бесплатный интерактивный тренажёр подготовки к ЕНТ (ҰБТ) по математике и математической грамотности на русском, казахском и узбекском языках: все 16 разделов НЦТ РК, 1 152 сценария поиска ошибки, пробное ЕНТ и сократический ИИ-тьютор (Claude API).",
  keywords: [
    "ЕНТ математика",
    "ҰБТ математика",
    "пробное ЕНТ математика",
    "байқау ҰБТ математика",
    "математическая грамотность ЕНТ",
    "математикалық сауаттылық ҰБТ",
    "подготовка к ЕНТ по математике бесплатно",
    "тренажер ЕНТ математика",
    "разбор задач ЕНТ математика",
    "Sinov UBT matematika",
    "BilimAI"
  ],
  alternates: {
    canonical: "https://bilimai.dpdns.org/",
    languages: {
      ru: "https://bilimai.dpdns.org/?lang=ru",
      kk: "https://bilimai.dpdns.org/?lang=kk",
      uz: "https://bilimai.dpdns.org/?lang=uz"
    }
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
    title: "BilimAI — Диагностическая подготовка к ЕНТ (ҰБТ) по математике",
    description:
      "Все 16 разделов спецификации НЦТ РК, тренировка поиска неверного шага (1 152 задачи), пробное ЕНТ и сократический ИИ-тьютор (Claude API) на RU / ҚАЗ / OʻZB.",
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
        alt: "BilimAI — Математика ЕНТ (ҰБТ): 16 разделов, поиск ошибки и ИИ-тьютор"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BilimAI — Математика ЕНТ (ҰБТ) · 16 разделов и тренажёр ошибок",
    description:
      "Пошаговый разбор 16 тем ЕНТ, поиск первого неверного шага (1 152 задачи), пробное ЕНТ и сократический ИИ-тьютор на RU / ҚАЗ / OʻZB.",
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
        audienceType: "Школьники 9–11 классов и абитуриенты ЕНТ (ҰБТ)"
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KZT"
      },
      description:
        "Интерактивный учебник и тренажёр подготовки к ЕНТ (ҰБТ) по математике и математической грамотности: 16 разделов НЦТ РК, 1 152 сценария поиска ошибки и сократический ИИ-тьютор."
    },
    {
      "@type": "Course",
      "@id": "https://bilimai.dpdns.org/#course",
      name: "Подготовка к ЕНТ (ҰБТ) по математике и математической грамотности (16 разделов НЦТ РК)",
      description:
        "Полный курс подготовки к ЕНТ по математике: линейные уравнения, неравенства, системы, проценты, вероятность, комбинаторика, корни и степени, квадратные уравнения и Виета, прогрессии, логарифмы, тригонометрия, производная, интегралы, планиметрия, векторы и стереометрия.",
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
