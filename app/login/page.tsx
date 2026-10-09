import type { Metadata } from "next";
import type { Language } from "@/lib/curriculum";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Вход в кабинет — BilimAI",
  description:
    "Войдите в локальный профиль BilimAI для сохранения прогресса по темам и пробным вариантам ЕНТ или начните тренировку без регистрации.",
  alternates: {
    canonical: "https://bilimai.dpdns.org/login"
  }
};

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const initialLang: Language =
    params.lang === "kk" || params.lang === "uz" || params.lang === "ru" ? params.lang : "ru";
  return <LoginClient initialLang={initialLang} />;
}
