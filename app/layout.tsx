import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BilimAI — Диагностическая подготовка к ЕНТ (ҰБТ) по математике",
  description:
    "Математика ЕНТ (ҰБТ) на казахском, русском и узбекском: 10 модулей спецификации, лаборатория разбора ошибок (720 сценариев) и персональный AI-роадмап на базе Claude.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
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
