import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#d98a2b",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bilimai.dpdns.org"),
  title: {
    default: "Aniq AI (ex-BilimAI) — Математика ЕНТ (ҰБТ) · Рентген черновика, Радар гранта ВУЗов РК и ИИ-тьютор",
    template: "%s · Aniq AI"
  },
  applicationName: "Aniq AI",
  description:
    "Интерактивная платформа точных наук для подготовки к ЕНТ (ҰБТ) по математике на русском, казахском и узбекском языках: Рентген черновика (Draft X-Ray), Радар гранта ВУЗов РК (КБТУ, IITU, AITU, SDU, КазНУ, Satbayev), 16 разделов НЦТ РК, 1 152 сценария поиска ошибки и сократический ИИ-тьютор Claude API.",
  keywords: [
    "Aniq AI",
    "Анық AI",
    "Aniq fanlar",
    "ЕНТ математика",
    "ҰБТ математика",
    "рентген черновика ЕНТ",
    "калькулятор гранта ЕНТ КБТУ IITU AITU SDU",
    "пробное ЕНТ математика",
    "байқау ҰБТ математика",
    "математическая грамотность ЕНТ",
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
    title: "Aniq AI — Точная диагностика излома логики и Радар гранта ЕНТ (ҰБТ)",
    description:
      "Рентген черновика (Draft X-Ray), Радар гранта ВУЗов РК, все 16 разделов спецификации НЦТ РК, 1 152 задачи поиска ошибки и сократический ИИ-тьютор (Claude API) на RU / ҚАЗ / OʻZB.",
    url: "https://bilimai.dpdns.org/",
    siteName: "Aniq AI",
    type: "website",
    locale: "ru_KZ",
    alternateLocale: ["kk_KZ", "uz_UZ"],
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Aniq AI — Математика ЕНТ (ҰБТ): Рентген черновика, Радар гранта РК и ИИ-тьютор"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniq AI — Математика ЕНТ (ҰБТ) · Рентген черновика и Радар гранта РК",
    description:
      "Пошаговый разбор 16 тем ЕНТ, Рентген черновика (Draft X-Ray), поиск первого неверного шага (1 152 задачи), пробное ЕНТ и сократический ИИ-тьютор на RU / ҚАЗ / OʻZB.",
    images: ["/og-cover.svg"]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://bilimai.dpdns.org/#app",
      name: "Aniq AI",
      alternateName: "BilimAI",
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
        "Интерактивная платформа точных наук Aniq AI для подготовки к ЕНТ (ҰБТ) по математике: Рентген черновика (Draft X-Ray), Радар гранта ВУЗов РК, 16 разделов НЦТ РК, 1 152 сценария поиска ошибки и сократический ИИ-тьютор."
    },
    {
      "@type": "Course",
      "@id": "https://bilimai.dpdns.org/#course",
      name: "Подготовка к ЕНТ (ҰБТ) по математике и математической грамотности (16 разделов НЦТ РК)",
      description:
        "Полный курс подготовки к ЕНТ по математике: линейные уравнения, неравенства, системы, проценты, вероятность, комбинаторика, корни и степени, квадратные уравнения и Виета, прогрессии, логарифмы, тригонометрия, производная, интегралы, планиметрия, векторы и стереометрия.",
      provider: {
        "@type": "Organization",
        name: "Aniq AI",
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
