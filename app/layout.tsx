import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1b3b6f",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  title: {
    default: "BilimAI — Математика ЕНТ (ҰБТ) · Пошаговый разбор и диагностика ошибок",
    template: "%s · BilimAI"
  },
  applicationName: "BilimAI",
  description:
    "Интерактивный тренажёр подготовки к ЕНТ (ҰБТ) по математике на русском, казахском и узбекском языках: все 16 разделов НЦТ РК, 1 152 сценария поиска ошибки и сократический ИИ-тьютор на базе Claude API.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    title: "BilimAI — Диагностическая подготовка к ЕНТ (ҰБТ) по математике",
    description:
      "16 разделов спецификации НЦТ РК, тренировка поиска неверного шага, пробное ЕНТ и сократический ИИ-тьютор (Claude API) на RU / ҚАЗ / OʻZB.",
    siteName: "BilimAI",
    type: "website",
    locale: "ru_KZ"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
