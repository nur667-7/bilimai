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
    default: "BilimAI — Единая ИИ-экосистема ЕНТ (ҰБТ) · 12 предметов × 10 вариантов, Рентген черновика и Радар гранта РК",
    template: "%s · BilimAI"
  },
  applicationName: "BilimAI",
  description:
    "Интерактивная ИИ-платформа BilimAI для подготовки ко всем 12 предметам ЕНТ (ҰБТ) на русском, казахском и узбекском языках: 10 вариантов по 40 вопросов (50 баллов) на каждый предмет, Рентген черновика (Draft X-Ray), Радар гранта ВУЗов РК (КБТУ, IITU, AITU, SDU, КазНУ, Satbayev), 1 152 сценария поиска ошибки и сократический ИИ-тьютор Claude API.",
  keywords: [
    "BilimAI",
    "bilimai.dpdns.org",
    "ЕНТ математика",
    "ҰБТ математика",
    "пробное ЕНТ 12 предметов",
    "рентген черновика ЕНТ",
    "калькулятор гранта ЕНТ КБТУ IITU AITU SDU",
    "пробное ЕНТ математика",
    "байқау ҰБТ математика",
    "математическая грамотность ЕНТ",
    "Sinov UBT matematika"
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
    title: "BilimAI — Единая ИИ-экосистема ЕНТ (ҰБТ) · 12 предметов × 10 вариантов и Радар гранта РК",
    description:
      "Все 12 предметов ЕНТ (по 10 вариантов из 40 вопросов = 50 баллов), Рентген черновика (Draft X-Ray), Радар гранта ВУЗов РК, 1 152 задачи поиска ошибки и сократический ИИ-тьютор (Claude API) на RU / ҚАЗ / OʻZB.",
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
        alt: "BilimAI — Единая ИИ-экосистема ЕНТ (ҰБТ): 12 предметов, Рентген черновика и Радар гранта РК"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BilimAI — Единая ИИ-экосистема ЕНТ (ҰБТ) · 12 предметов × 10 вариантов",
    description:
      "Все 12 предметов ЕНТ (4 800 заданий), Рентген черновика (Draft X-Ray), поиск первого неверного шага (1 152 задачи), Радар гранта РК и сократический ИИ-тьютор на RU / ҚАЗ / OʻZB.",
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
        "Интерактивная ИИ-платформа BilimAI для подготовки ко всем 12 предметам ЕНТ (ҰБТ): 10 вариантов по 40 вопросов на предмет, Рентген черновика (Draft X-Ray), Радар гранта ВУЗов РК, 1 152 сценария поиска ошибки и сократический ИИ-тьютор."
    },
    {
      "@type": "Course",
      "@id": "https://bilimai.dpdns.org/#course",
      name: "Подготовка к ЕНТ (ҰБТ) по всем 12 официальным предметам НЦТ РК",
      description:
        "Полный курс подготовки к ЕНТ (ҰБТ): Профильная математика, Физика, Информатика, Химия, Биология, География, История Казахстана, Всемирная история, Основы права, Английский язык, Математическая грамотность и Грамотность чтения.",
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
