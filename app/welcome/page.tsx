import type { Metadata } from "next";
import type { Language } from "@/lib/curriculum";
import WelcomeClient from "./welcome-client";

export const metadata: Metadata = {
  title: "Обзор платформы и выбор предмета ЕНТ (ҰБТ)",
  description:
    "Интерактивный обзор BilimAI: попробуйте найти ошибку в решении без регистрации и выберите любой из 12 официальных предметов ЕНТ (НЦТ РК — 10, 20 или 40 заданий).",
  alternates: {
    canonical: "https://bilimai.dpdns.org/welcome",
    languages: {
      ru: "https://bilimai.dpdns.org/welcome?lang=ru",
      kk: "https://bilimai.dpdns.org/welcome?lang=kk",
      uz: "https://bilimai.dpdns.org/welcome?lang=uz"
    }
  }
};

export default async function WelcomePage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const rawLang = resolved?.lang;
  const initialLang: Language =
    rawLang === "kk" || rawLang === "uz" || rawLang === "ru" ? rawLang : "ru";

  return <WelcomeClient initialLang={initialLang} />;
}
