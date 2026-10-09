import type { Metadata } from "next";
import type { Language } from "@/lib/curriculum";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = {
  title: "Создать профиль — BilimAI",
  description:
    "Создайте локальный профиль ученика или учителя в BilimAI за 20 секунд или начните подготовку к ЕНТ без регистрации.",
  alternates: {
    canonical: "https://bilimai.dpdns.org/register"
  }
};

export default async function RegisterPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const initialLang: Language =
    params.lang === "kk" || params.lang === "uz" || params.lang === "ru" ? params.lang : "ru";
  return <RegisterClient initialLang={initialLang} />;
}
