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
    default: "BilimAI — Тренажёр ЕНТ (ҰБТ) по 12 предметам НЦТ РК · Проверка решения по шагам",
    template: "%s · BilimAI"
  },
  applicationName: "BilimAI",
  description:
    "Интерактивная платформа BilimAI для подготовки ко всем 12 официальным предметам ЕНТ (ҰБТ) на русском, казахском и узбекском языках: официальный формат НЦТ РК (10, 20 и 40 заданий) и тренировочные наборы по 40 вопросов, проверка решения по шагам, 1 152 задачи на поиск ошибки и ИИ-тьютор (Claude API).",
  keywords: [
    "BilimAI",
    "bilimai.dpdns.org",
    "ЕНТ математика",
    "ҰБТ математика",
    "пробное ЕНТ 12 предметов",
    "формат НЦТ РК",
    "тренажер ошибок ЕНТ",
    "пробное ЕНТ математика",
    "байқау ҰБТ математика",
    "математическая грамотность ЕНТ",
    "Sinov UBT matematika"
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
    title: "BilimAI — Тренажёр ЕНТ (ҰБТ) по 12 предметам НЦТ РК · Проверка решения по шагам",
    description:
      "Все 12 предметов ЕНТ в официальном формате НЦТ РК (10 / 20 / 40 заданий) и расширенном тренировочном режиме, проверка черновика по шагам, 1 152 задачи поиска ошибки и ИИ-тьютор на RU / ҚАЗ / OʻZB.",
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
        alt: "BilimAI — Тренажёр ЕНТ (ҰБТ) по 12 предметам НЦТ РК"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BilimAI — Тренажёр ЕНТ (ҰБТ) по 12 предметам НЦТ РК",
    description:
      "Все 12 предметов ЕНТ (формат НЦТ 10 / 20 / 40 заданий), проверка решения по шагам, поиск первой ошибки (1 152 задачи) и ИИ-тьютор на RU / ҚАЗ / OʻZB.",
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
        "Интерактивный тренажёр BilimAI для подготовки ко всем 12 предметам ЕНТ (ҰБТ) по стандарту НЦТ РК (10 / 20 / 40 заданий), проверка черновика по шагам, 1 152 сценария поиска ошибки и ИИ-тьютор."
    },
    {
      "@type": "Course",
      "@id": "https://bilimai.dpdns.org/#course",
      name: "Подготовка к ЕНТ (ҰБТ) по всем 12 официальным предметам НЦТ РК",
      description:
        "Курс и тренажёр подготовки к ЕНТ (ҰБТ): Профильная математика, Физика, Информатика, Химия, Биология, География, История Казахстана, Всемирная история, Основы права, Английский язык, Математическая грамотность и Грамотность чтения.",
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
