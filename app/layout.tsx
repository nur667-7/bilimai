import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BilimAI — учиться с пониманием",
  description: "Математика на русском, казахском и узбекском: короткие объяснения, практика и разбор ошибок. Ранний MVP для совершеннолетних студентов.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}

